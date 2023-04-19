import * as express from 'express'
import * as http from "http";
import {CApiRouter} from "./CApiRouter";
const cors = require('cors')

class MainProc {
    init() {
        const app = express()
        app.disable('x-powered-by')
        app.use(express.json())
        app.use(cors())

        const basePath = process.env.BASE_PATH ?? '/was/v1'
        new CApiRouter(app, basePath)


        const port_s = process.env.SERVICE_PORT ?? '80'
        const port = Number.parseInt(port_s)
        const server = http.createServer(app)
        server.listen(port, '0.0.0.0')
    }
}

const gMainProc = new MainProc()

export default gMainProc