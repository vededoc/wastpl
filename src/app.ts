import {DBBase} from "./db/DBBase";
import {MariaDBClient} from "./db/MariaDBClient";
// import {PgClient} from "./db/PgClient";
import * as express from 'express'
import {program} from "commander";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface AppCfg {
    dbBrand: string
    dbName: string
    dbHost: string
    dbPort?: number
    dbUser: string
    dbPassword: string
    servicePort: number
    clusterCount: number
    basePath: string
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
    resp.json({code, data, msg})
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

    gAppCfg.dbBrand = process.env.dbBrand
    gAppCfg.dbUser = process.env.dbUser
    gAppCfg.dbPassword = process.env.dbPassword
    gAppCfg.dbHost = process.env.dbHost
    gAppCfg.dbPort = process.env.dbPort != undefined ? Number.parseInt(process.env.dbPort) : undefined
    gAppCfg.dbName = process.env.dbName
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

    program
        .option('-w, --wor-dir <working-dir>', 'working directory')
        .version(pkgJson.version)
    program.parse()

}