import {Express} from "express";
import * as express from 'express'
import {ApiResp, GetDb} from "./app";
import {GetUserReq, SignInReq, SignUpReq} from "./apimsg";
import {ErrCode} from "./def";
import {waitSec} from "@vededoc/sjsutils";
import logger from "./logger";
import {gGoogleAuthSvc} from "./GoogleAuthSvc";
import {UserProfileRec} from "./db/dbrecord";

export class CApiRouter {
    app: Express.Application
    constructor(app: Express, basePath: string) {
        this.init(app, basePath)
    }

    private init(app: Express, basePath: string) {
        const db = GetDb()
        const router = express.Router()
        app.use(basePath, router)

        router.use(basePath, async (req, resp, next) => {

            next()
        })

        router.post('/signUp', async (req, resp) => {
            const rqm = req.body as SignUpReq
            if(!rqm.serviceId) {
                ApiResp(resp, ErrCode.badRequest)
                return;
            }

            try {
                if(rqm.authType == 'google') {
                    const vr = (await gGoogleAuthSvc.verify(rqm.credential))
                    const uf: UserProfileRec = {
                        ...vr,
                        serviceId: rqm.serviceId,
                        password: null, signupDate: null, status: "",
                        phoneNumber: null
                    }
                    await db.addUser(uf)
                }
                else {
                    ApiResp(resp, ErrCode.badRequest)
                }
            } catch (err) {
                console.trace(err)
                ApiResp(resp, ErrCode.dataError, undefined, err.message)
            }
            ApiResp(resp, ErrCode.ok)
        })
        router.post('/signIn', async (req, resp) =>{
            const rqm = req.body as SignInReq
            try {
                const user = await db.getUser(rqm.userId)
                if(user.password != rqm.password) {
                    logger.info('*** password not match')
                    await waitSec(3)
                    ApiResp(resp, ErrCode.authFail)
                    return
                }

                ApiResp(resp, ErrCode.ok, {token: '1234'})
            } catch (err) {
                ApiResp(resp, ErrCode.error, undefined, err.message)
            }
        })

        router.post('/getUser', async (req: express.Request, resp: express.Response) => {
            const rqm = req.body as GetUserReq
            const res = await db.getUser(rqm.userId)
            ApiResp(resp, ErrCode.ok, res)
        })


    }
}