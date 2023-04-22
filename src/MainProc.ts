import * as express from 'express'
import * as http from "http";
import {CApiRouter} from "./CApiRouter";
import {gAppCfg, GetDb} from "./app";
import logger from "./logger";
import {CAPI_PATH} from "./apimsg";
const cors = require('cors')

class MainProc {
    init() {
        logger.info('worker init')
        const app = express()
        app.disable('x-powered-by')
        app.use(express.json())
        app.use(cors())
        const db = GetDb()
        app.use(gAppCfg.basePath, (req: express.Request, resp, next) => {
            db.apiLog(req.path, req.body).catch(err => {
                console.error(err)
            })
            next()
        })

        new CApiRouter(app, gAppCfg.basePath + CAPI_PATH)


        const server = http.createServer(app)
        server.listen(gAppCfg.servicePort, '0.0.0.0')
    }
}

const gMainProc = new MainProc()

export default gMainProc