import {DBBase} from "./db/DBBase";
import {GetDb} from "./app";
import {MIN_MS} from "@vededoc/sjsutils";
import {ServiceProfileRec} from "./db/dbrecord";
import logger from "./logger";
import wasRedis from "./WasRedis";
import {raw} from "express";

class Services {
    db: DBBase
    svcMap: Map<string, ServiceProfileRec> = new Map()

    init() {
        this.db = GetDb()
        this.startPoll();
        this.loadServices().catch(err =>{
            console.trace(err)
        })

        wasRedis.listenChannel( async cmsg => {
            if(cmsg.event == 'serviceChanged') {
                try {
                    const svc = await this.db.getService(cmsg.serviceId)
                    if(svc) {
                        logger.info('update service profile, serviceId=%s', svc.serviceId)
                        this.svcMap.set(svc.serviceId, svc)
                    } else {
                        logger.info('svc null')
                    }
                } catch (err) {
                    console.trace(err)
                }
            }
        })
    }

    private startPoll() {
        setInterval( ()=>{
           this.loadServices().catch(err => {
               console.trace(err)
           })
        }, MIN_MS*10)
    }

    private async loadServices() {
        const svcs = await this.db.retrieveServices()
        const sm = new Map<string, ServiceProfileRec>()
        svcs.forEach( svc => {
            sm.set(svc.serviceId, svc)
        })
        this.svcMap = sm
        logger.info('loaded %d services', sm.size)
    }

    getServices() {
        return this.svcMap
    }

    getService(serviceId: string) {
        return this.svcMap.get(serviceId)
    }
}

const gServices = new Services()
export default gServices