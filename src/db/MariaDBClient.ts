import {DBBase} from "./DBBase";
import * as mariadb from 'mariadb'
import {ServiceProfileRec, UserProfileRec} from "./dbrecord";
import {toSqlDate} from "@vededoc/sjsutils";
import logger from "../logger";
import {ErrCode} from "../def";
import {AppErr} from "../AppErr";


export class MariaDBClient extends DBBase {
    pool: mariadb.Pool

    init(user: string, password: string, database: string, host: string, port?: number) {
        this.pool = mariadb.createPool({
            dateStrings: true, // To avoid timezone related issues, convert time to Date manually
            connectionLimit: 10,
            idleTimeout: 10,
            minimumIdle: 1,
            user, password, database,
            host,
            port
        })
        // this.pool.on('connection', conn => {
        //     logger.info('on conn, status:%d, id:%s', conn.info.status, conn.info.threadId)
        // })
        // this.pool.on('acquire', conn => {
        //     logger.info('db conn acquired,', conn.info.threadId)
        // })
        // this.pool.on('release', conn => {
        //     logger.info('db conn released,', conn.info.threadId)
        // })

        // setInterval(async ()=>{
        //     logger.info('conn info, a=%d, i=%d',this.pool.activeConnections(), this.pool.idleConnections())
        // }, 1000)
    }

    async getUser(keyType: string, userKey: string): Promise<UserProfileRec> {
        if(keyType == 'userId') {
            const res = await this.pool.execute<UserProfileRec>('select * from user_profile where userId=(?)', [userKey])
            return res[0]
        } else if(keyType == 'email') {
            const res = await this.pool.execute<UserProfileRec>('select * from user_profile where email=(?)', [userKey])
            return res[0]
        } else {
            throw new AppErr(ErrCode.invalid)
        }
    }

    async apiLog(urlPath: string, msg: any): Promise<void> {
        const ct = toSqlDate(new Date(), true)
        return this.pool.execute('insert into api_log (ctime, serviceId, urlPath, data) values (?,?,?,?)',
            [ct, msg.serviceId ?? null, urlPath, JSON.stringify(msg)])
    }

    async getService(serviceId: string): Promise<ServiceProfileRec> {
        const res = await this.pool.query<ServiceProfileRec>(
            'select * from service_profile where serviceId=(?)', [serviceId])
        return res[0]
    }

    async newService(service:ServiceProfileRec): Promise<number> {
        const updateDate = toSqlDate(new Date(), true)
        const res = await this.pool.execute(
            'insert into service_profile (serviceId, apiKey, status, updateDate, registeredDate, description, polices) values (?,?,?,?,?,?,?)',
            [service.serviceId, service.apiKey, 1, updateDate, updateDate, service.description ?? null, service.policies ?? null])
        return res.affectedRows;
    }

    async removeService(serviceId: string): Promise<number> {
        const res = await this.pool.execute('delete from service_profile where serviceId=?', [serviceId])
        return res.affectedRows;
    }

    async updateService(service: ServiceProfileRec): Promise<number> {
        const updateDate = toSqlDate(new Date(), true)
        const res = await this.pool.execute(
            'insert into service_profile (serviceId, status, upateDate, polices) values (?,?,?,?)',
            [service.serviceId, service.status, updateDate, service.policies])
        return res.affectedRows;
    }

    async changeServiceStatus(serviceId: string, status: number): Promise<number> {
        const res = await this.pool.execute('update service_profile set status=? where serviceId=?',
            [status, serviceId])
        return res.affectedRows;
    }

    async retrieveServices(): Promise<ServiceProfileRec[]> {
        const res = await this.pool.execute<ServiceProfileRec[]>('select * from service_profile')
        for(let row of res) {
            row.registeredDate = new Date(row.registeredDate + 'Z')
            row.updateDate = new Date(row.updateDate+'Z')
        }
        return res;
    }

    async deleteApiLog(ct: Date): Promise<number> {
        const cts = toSqlDate(ct, true)
        const res = await this.pool.query('delete from api_log where ctime < ?',[cts])
        return res.affectedRows
    }


    async addUser(uf: UserProfileRec) {
        if(!uf.email) {
            throw new AppErr(ErrCode.dataError, 'email invalid')
        }

        const cts = toSqlDate(new Date, true)
        try {
            // const fres = await this.pool.execute('select email from user_profile where email=?', [uf.email])
            // if(fres[0].email) {
            //     throw new AppErr(ErrCode.duplicated)
            // }

            const res = await this.pool.execute(
                'insert into user_profile (serviceId, userId, password, userName, email, authType, phoneNumber, address, status, signupDate, imgUrl) values (?,?,?,?,?,?,?,?,?,?,?)',
                [uf.serviceId, uf.userId ?? null, uf.password??null,
                    uf.userName??null, uf.email, uf.authType,
                    uf.phoneNumber??null, uf.address??null, 1, cts, uf.imgUrl??null]
            )
            return res.affectedRows
        } catch (err) {
            console.trace(err)
            if(err.code == 'ER_DUP_ENTRY') {
                throw new AppErr(ErrCode.duplicated)
            } else {
                throw new AppErr(ErrCode.dataError)
            }
        }
    }

    private checkUndefined(obj: any) {
        const res = {...obj}
        for(const k in res) {
            if(res[k] === undefined) {
                res[k] = null
            }
        }
        return res
    }
}