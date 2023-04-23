import {Express} from "express";
import {ApiResp, GetDb} from "./app";
import * as express from "express";
import {ServiceProfileRec} from "./db/dbrecord";
import {randomStr, waitSec} from "@vededoc/sjsutils";
import {ErrCode} from "./def";
import logger from "./logger";
import wasRedis from "./WasRedis";

export class SApiRouter {

    constructor(app: Express, basePath: string) {
        this.init(app, basePath)
    }

    private init(app: Express, basePath: string) {
        const db = GetDb()
        const router = express.Router()
        app.use(basePath, router)

        router.post('/newService', async (req, resp) => {
            const apiKey = randomStr(32)
            logger.info('new service ')
            const rqm = req.body as ServiceProfileRec
            rqm.apiKey = apiKey
            try {
                await db.newService(rqm)
                const data = {
                    apiKey,
                }
                ApiResp(resp, ErrCode.ok, data)
                wasRedis.notifyServiceChanged(rqm.serviceId)
            } catch (err) {
                console.trace(err)
                ApiResp(resp, ErrCode.dataError, undefined, 'fail to make new service')
            }
        })

        router.post('/removeService', async (req, resp) => {
            const {serviceId} = req.body
            if(!serviceId) {
                await waitSec(1)
                ApiResp(resp, ErrCode.badRequest)
                return
            }

            try {
                await db.removeService(serviceId)
                ApiResp(resp, ErrCode.ok)
            } catch (err) {
                ApiResp(resp, ErrCode.dataError, undefined, 'fail to remove service')
            }
        })
    }
}