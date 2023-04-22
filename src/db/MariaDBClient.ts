import {DBBase} from "./DBBase";
import * as mariadb from 'mariadb'
import {UserProfileRec} from "./dbrecord";
import {toSqlDate} from "@vededoc/sjsutils";
export class MariaDBClient extends DBBase {
    pool: mariadb.Pool

    init(user: string, password: string, database: string, host: string, port?: number) {
        this.pool = mariadb.createPool({
            dateStrings: true, // To avoid timezone related issues, convert time to Date mannually
            user, password, database,
            host,
            port
        })
    }

    async getUser(userId: string): Promise<UserProfileRec> {
        const res =  await this.pool.execute<UserProfileRec>('select * from user_profile where userId=(?)', [userId])
        return res[0]
    }

    apiLog(urlPath: string, msg: any): Promise<void> {
        const ct = toSqlDate(new Date(), true)
        return this.pool.execute('insert into api_log (ctime, serviceId, urlPath, data) values (?,?,?,?)',
            [ct, msg.serviceId ?? null, urlPath, JSON.stringify(msg)])
    }


}