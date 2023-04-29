import {Express} from "express";
import * as express from "express";
import {ApiResp} from "./app";
import {ErrCode} from "./def";
import logger, {GetLogLevel, SetLogLevel} from "./logger";

export class MgmtRouter {
    app: Express.Application
    constructor(app: Express, basePath: string) {
        this.init(app, basePath)
    }

    private init(app: Express, basePath: string) {
        const router = express.Router()
        app.use(basePath, router)

        router.post('/logLevel', async (req, resp) => {
            const rqm = req.body
            switch (rqm.level) {
                case 'error':
                case 'warn':
                case 'info':
                case 'debug':
                case 'trace':
                    SetLogLevel(rqm.level)
                    ApiResp(resp, ErrCode.ok)
                    break
                default:
                    ApiResp(resp, ErrCode.badRequest)
            }
        })

        router.get('/logLevel', (req,resp) => {
            // ApiResp(resp, ErrCode.ok, {level: GetLogLevel()})
            logger.info('log level api, level', GetLogLevel())
            ApiResp(resp, ErrCode.ok, {level: GetLogLevel()})
        })
    }
}