import {Express} from "express";
import * as express from 'express'
import {ApiResp, GetDb} from "./app";
import {GetUserReq, SignInReq, SignUpReq} from "./apimsg";
import {ErrCode, UserProfile} from "./def";
import {waitSec} from "@vededoc/sjsutils";
import logger from "./logger";
import {gGoogleAuthSvc} from "./GoogleAuthSvc";
import {UserProfileRec} from "./db/dbrecord";
import {AppErr} from "./AppErr";
import gServices from "./Services";
import * as jwt from 'jsonwebtoken'
import {DBBase} from "./db/DBBase";
import {GetJwtToken} from "./util";
export class CApiRouter {
    app: Express.Application
    dbCl: DBBase


    constructor(app: Express, basePath: string) {
        this.dbCl = GetDb()
        this.init(app, basePath)
    }

    private init(app: Express, basePath: string) {
        const db = this.dbCl
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
                    const uf = vr as unknown as UserProfileRec
                    uf.serviceId = rqm.serviceId
                    uf.authType = rqm.authType
                    await db.addUser(uf)
                    ApiResp(resp, ErrCode.ok)
                }
                else {
                    ApiResp(resp, ErrCode.badRequest)
                }
            } catch (err) {
                console.trace(err)
                this.sendErrResp(resp, err)
            }

        })

        router.post('/signIn', this.signInProc)
        router.post('/getUser', this.getUserProc)

        // router.post('/getUser', async (req: express.Request, resp: express.Response) => {
        //     const rqm = req.body as GetUserReq
        //     const res = await db.getUser(rqm.userId)
        //     ApiResp(resp, ErrCode.ok, res)
        // })

    }

    private sendErrResp(resp: express.Response, err: Error) {
        if(err instanceof AppErr) {
            ApiResp(resp, err.code, undefined, err.message)
        } else {
            ApiResp(resp, ErrCode.error, undefined, err.message)
        }
    }

    private signInProc = async (req: express.Request, resp: express.Response) => {
        const db = GetDb()
        const rqm = req.body as SignInReq
        let token: string
        try {
            if(rqm.authType == 'google') {
                const res = await gGoogleAuthSvc.verify(rqm.credential)
                const ures = await db.getUser('email', res.email)
                const svc = gServices.getService(rqm.serviceId)
                const t1 = performance.now()
                token = jwt.sign({userName: ures.userName}, svc.privKey, {algorithm: 'RS256'})
                // logger.debug('sign dur:', performance.now()-t1)
                // logger.debug('token:', token)
            } else {
                const user = await db.getUser('userId', rqm.userId)
                if (user.password != rqm.password) {
                    logger.info('*** password not match')
                    await waitSec(3)
                    ApiResp(resp, ErrCode.authFail)
                    return
                }
            }

            ApiResp(resp, ErrCode.ok, {token})
        } catch (err) {
            console.trace(err)
            this.sendErrResp(resp, err)
        }
    }

    private getUserProc = async (req: express.Request, resp: express.Response) => {
        const uf = {} as UserProfile
        const token = GetJwtToken(req.headers)
        const rqm = req.body as GetUserReq
        if(!token) {
            resp.status(403).send({code:ErrCode.badRequest})
            return;
        }
        const svc = gServices.getService(rqm.serviceId)
        const payload = jwt.verify(token, svc.publicKey)
        logger.info('payload', payload)
        ApiResp(resp, ErrCode.ok, payload)
    }


}