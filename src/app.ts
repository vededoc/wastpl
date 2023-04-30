import {DBBase} from "./db/DBBase";
import {MariaDBClient} from "./db/MariaDBClient";
import * as express from 'express'
import {program} from "commander";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import {BaseResp} from "./apimsg";

export interface AppCfg {
    pkgName: string
    dbBrand: string
    dbName: string
    dbHost: string
    dbPort?: number
    dbUser: string
    dbPassword: string
    servicePort: number
    clusterCount: number
    basePath: string
    apiLog: boolean

    scheduler: boolean
    dataDurations: number

    // redis
    redisHost: string
    redisPort?: number
    redisDb?: number
    redisUser?: string
    redisPassword?: string

    // SNS auth
    googleClientId?: string

    logLevel: string //'info' | 'debug' | 'warn' | 'error' | 'trace'
}

export const gAppCfg = {} as AppCfg

export function GetDb() {
   if(!Db) {
       if(gAppCfg.dbBrand == 'mariadb') {
           Db = new MariaDBClient()
       } else if(gAppCfg.dbBrand == 'pg') {
           // Db = new PgClient()
       }
       Db.init(gAppCfg.dbUser, gAppCfg.dbPassword, gAppCfg.dbName, gAppCfg.dbHost, gAppCfg.dbPort)
   }
   return Db;
}

export function ApiResp(resp: express.Response, code: string, data?:any, msg?:string) {
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

    gAppCfg.pkgName = pkgJson.name
    gAppCfg.dbBrand = process.env.dbBrand ?? 'mariadb'
    gAppCfg.dbUser = process.env.dbUser ?? 'wastpl'
    gAppCfg.dbPassword = process.env.dbPassword ?? 'wastpl'
    gAppCfg.dbHost = process.env.dbHost ?? 'localhost'
    gAppCfg.dbPort = process.env.dbPort != undefined ? Number.parseInt(process.env.dbPort) : undefined
    gAppCfg.dbName = process.env.dbName ?? 'wastpl'
    if(process.env.servicePort != undefined) {
        gAppCfg.servicePort = Number.parseInt(process.env.servicePort)
    }
    if(process.env.clusterCount != undefined) {
        gAppCfg.clusterCount = Number.parseInt(process.env.clusterCount)
    } else {
        gAppCfg.clusterCount = os.cpus().length
    }
    gAppCfg.servicePort = Number.parseInt( process.env.servicePort ?? '19000')
    gAppCfg.basePath = process.env.basePath ?? '/was/v1'
    gAppCfg.apiLog = (process.env.apiLog ?? '0') == '1' ? true:false

    // redis
    const {redisHost, redisPort, redisUser, redisPassword, redisDb} = process.env
    gAppCfg.redisHost = redisHost ?? 'localhost'
    if(redisPort != undefined) {
        gAppCfg.redisPort = Number.parseInt(redisPort)
    }
    gAppCfg.redisUser = redisUser
    gAppCfg.redisPassword = redisPassword
    if(redisDb != undefined) {
        gAppCfg.redisDb = Number.parseInt(redisDb)
    }

    gAppCfg.logLevel = process.env.logLevel ?? 'info'

    gAppCfg.googleClientId = process.env.googleClientId


    program
        .option('-w, --work-dir <working-dir>', 'working directory')
        .option('--scheduler', 'run as worker for scheduling')
        .option('--log-level [log level]')
        .option('--gen-keys [bits]')
        .version(pkgJson.version)
    program.parse()

    const opts = program.opts()
    gAppCfg.scheduler = opts.scheduler ?? false;
}