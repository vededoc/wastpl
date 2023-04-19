import {DBBase} from "./DBBase";
import * as mariadb from 'mariadb'
import {UserProfileRec} from "./dbrecord";
export class MariaDBClient extends DBBase {
    pool: mariadb.Pool

    init(user: string, password: string, database: string, host: string, port?: number) {
        this.pool = mariadb.createPool({
            dateStrings: true,
            user, password, database,
            host,
            port
        })
    }

    async getUser(userId: string): Promise<UserProfileRec> {
        const res =  await this.pool.execute<UserProfileRec>('select * from user_profile where userId=(?)', [userId])
        return res[0]
    }
}