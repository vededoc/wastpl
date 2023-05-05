import {DBBase} from "./db/DBBase";
import {MariaDBClient} from "./db/MariaDBClient";
import * as express from 'express'
import {program} from "commander";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {BaseResp} from "./apimsg";

export interface AppCfg {

    DB_BRAND: string
    DB_NAME: string
    DB_HOST: string
    DB_PORT?: number
    DB_USER: string
    DB_PASSWORD: string
    SERVICE_PORT: number
    CLUSTER_COUNT: number
    BASE_PATH: string
    API_LOG: boolean

    SCHEDULER: boolean
    DATA_DURATIONS: number

    // redis
    REDIS_HOST: string
    REDIS_PORT?: number
    REDIS_DB?: number
    REDIS_USER?: string
    REDIS_PASSWORD?: string

    // SNS auth
    GOOGLE_CLIENT_ID?: string

    pkgName: string
    logLevel: string //'info' | 'debug' | 'warn' | 'error' | 'trace'
}

export const gAppCfg = {
    BASE_PATH: '/was/v1'
} as AppCfg

export function GetDb() {
   if(!Db) {
       if(gAppCfg.DB_BRAND == 'mariadb') {
           Db = new MariaDBClient()
       } else if(gAppCfg.DB_BRAND == 'pg') {
           // Db = new PgClient()
       }
       Db.init(gAppCfg.DB_USER, gAppCfg.DB_PASSWORD, gAppCfg.DB_NAME, gAppCfg.DB_HOST, gAppCfg.DB_PORT)
   }
   return Db;
}

/**
 * send json response
 *
 * @param resp - response object of express request handler
 * @param code - response code
 * @param data - response data
 * @param msg - optional message
 * @return - none
 */
export function ApiResp(resp: express.Response, code: string, data?:any, msg?:string): void {
    const rpm  = {code} as BaseResp
    if(data) rpm.data = data
    if(msg) rpm.msg = msg
    resp.json(rpm)
}

let Db: DBBase;

export function fileExists(file: string): boolean {
    try {
        fs.accessSync(file, fs.constants.F_OK)
        return true;
    } catch (err) {
        return false
    }
}

export function InitApp() {
    const rootPath = require('app-root-path')
    const pkgfile = path.resolve(rootPath.path, 'package.json')
    const pkgJson = require(pkgfile)
    Object.assign(gAppCfg, process.env)

    gAppCfg.pkgName = pkgJson.name
    gAppCfg.DB_BRAND = gAppCfg.DB_BRAND ?? 'mariadb'
    gAppCfg.DB_USER = gAppCfg.DB_USER ?? 'wastpl'
    // gAppCfg.dbPassword = process.env.dbPassword ?? 'wastpl'
    gAppCfg.DB_HOST = gAppCfg.DB_HOST ?? 'localhost'
    if(gAppCfg.DB_PORT != undefined) {
        gAppCfg.DB_PORT = Number.parseInt(gAppCfg.DB_PORT as any)
    }

    gAppCfg.DB_NAME = gAppCfg.DB_NAME ?? 'wastpl'

    if(gAppCfg.SERVICE_PORT != undefined) {
        gAppCfg.SERVICE_PORT = Number.parseInt(gAppCfg.SERVICE_PORT as any)
    }

    if(gAppCfg.CLUSTER_COUNT != undefined) {
        gAppCfg.CLUSTER_COUNT = Number.parseInt(gAppCfg.CLUSTER_COUNT as any)
    } else {
        gAppCfg.CLUSTER_COUNT = os.cpus().length
    }

    gAppCfg.BASE_PATH = gAppCfg.BASE_PATH ?? '/was/v1'

    if(gAppCfg.API_LOG === undefined) {
        gAppCfg.API_LOG = false;
    } else {
        gAppCfg.API_LOG = (gAppCfg.API_LOG as any) === "1"
    }


    // redis
    gAppCfg.REDIS_HOST = gAppCfg.REDIS_HOST ?? 'localhost'
    if(gAppCfg.REDIS_PORT != undefined) {
        gAppCfg.REDIS_PORT = Number.parseInt(gAppCfg.REDIS_PORT as any)
    }
    if(gAppCfg.REDIS_DB != undefined) {
        gAppCfg.REDIS_DB = Number.parseInt(gAppCfg.REDIS_DB as any)
    }

    gAppCfg.logLevel = gAppCfg.logLevel ?? 'info'

    program
        .option('-w, --work-dir <working-dir>', 'working directory')
        .option('--scheduler', 'run as worker for scheduling')
        .option('--log-level [log level]')
        .option('--gen-keys [bits]')
        .version(pkgJson.version)
    program.parse()

    const opts = program.opts()
    gAppCfg.SCHEDULER = opts.scheduler ?? false;
}