import {DBBase} from "./DBBase";
import {UserProfileRec} from "./dbrecord";
import {Pool} from 'pg'
export class PgClient extends DBBase {
    pool: Pool
    init(user: string, password: string, database: string, host: string, port?: number) {
        this.pool = new Pool({
            user, password, database,
            host, port
        })
    }

    async getUser(userId: string): Promise<UserProfileRec> {
        const res = await this.pool.query('select * from user_profile where "userId"=($1)', [userId])
        return res.rows[0];
    }

}