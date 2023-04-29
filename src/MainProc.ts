import * as express from 'express'
import * as http from "http";
import {CApiRouter} from "./CApiRouter";
import {ApiResp, gAppCfg, GetDb} from "./app";
import logger from "./logger";
import {CAPI_PATH, MGMT_PATH, SAPI_PATH} from "./apimsg";
import {SApiRouter} from "./SApiRouter";
import wasRedis from "./WasRedis";
import {DBBase} from "./db/DBBase";
import {ServiceProfileRec} from "./db/dbrecord";
import gServices from "./Services";
import * as sqlstring from 'sqlstring'
import {MgmtRouter} from "./MgmtRouter";
import {ErrCode} from "./def";
const cors = require('cors')

class MainProc {
    private db: DBBase
    private services: Map<string, ServiceProfileRec>
    init() {
        logger.info('worker init')
        wasRedis.init();
        gServices.init();
        const db = GetDb()
        this.db = db


        const app = express()
        app.disable('x-powered-by')
        app.use(express.json())
        app.use(cors())

        app.use(gAppCfg.basePath, (req: express.Request, resp, next) => {
            if(gAppCfg.apiLog) {
                db.apiLog(req.path, req.body).catch(err => {
                    console.error(err)
                })
            }
            next()
        })
        new MgmtRouter(app, gAppCfg.basePath + MGMT_PATH)
        new CApiRouter(app, gAppCfg.basePath + CAPI_PATH)
        new SApiRouter(app, gAppCfg.basePath + SAPI_PATH)

        app.all('*', (req, resp) => {
            resp.status(404).end()
            return;
        })


        const server = http.createServer(app)
        server.listen(gAppCfg.servicePort, '0.0.0.0')
    }

    async loadServices() {
        try {
            const res = await this.db.retrieveServices()
            const svcs = new Map()
            for(let r of res) {
                svcs.set(r.serviceId, r)
            }
            this.services = svcs
        } catch (err) {
            console.trace(err)
        }
    }
}

const gMainProc = new MainProc()

export default gMainProc