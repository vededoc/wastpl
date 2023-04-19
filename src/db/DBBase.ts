import {UserProfileRec} from "./dbrecord";

export abstract class DBBase {
    abstract init(user: string, password: string, database: string, host: string, port?: number)
    abstract getUser(userId: string): Promise<UserProfileRec>
}