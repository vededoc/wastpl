import {DAY_MS, HOUR_MS, MIN_MS, SEC_MS} from "@vededoc/sjsutils";
import logger from "./logger";
import {GetDb} from "./app";

export class Scheduler {
    checkTimer: NodeJS.Timer
    lastCheckDate: Date

    constructor() {
        //this.init()
    }

    init() {
        const db = GetDb()
        this.checkTimer = setInterval(async ()=>{
            const ct = new Date()
            if(this.lastCheckDate===undefined || ct.getDate() != this.lastCheckDate.getDate()) {
                logger.info('on check timer...')
                const nt = new Date(ct.getTime() - (DAY_MS*30))
                await db.deleteApiLog(nt)
                this.lastCheckDate = ct
            }
        }, MIN_MS * 10)
    }
}

const gScheduler = new Scheduler()
export default gScheduler