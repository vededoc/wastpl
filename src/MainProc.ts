import * as express from 'express'
import * as http from "http";
import {CApiRouter} from "./CApiRouter";
import {gAppCfg} from "./app";
const cors = require('cors')

class MainProc {
    init() {
        const app = express()
        app.disable('x-powered-by')
        app.use(express.json())
        app.use(cors())

        new CApiRouter(app, gAppCfg.basePath)
        const server = http.createServer(app)
        server.listen(gAppCfg.servicePort, '0.0.0.0')
    }
}

const gMainProc = new MainProc()

export default gMainProc