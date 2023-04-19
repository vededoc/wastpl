import {DBBase} from "./db/DBBase";
import {MariaDBClient} from "./db/MariaDBClient";
import {PgClient} from "./db/PgClient";
import * as express from 'express'

export interface Cfg {

}

export function GetDb() {
   if(!Db) {
       const port = process.env.DB_PORT != undefined ? Number.parseInt(process.env.DB_PORT) : undefined
       if(process.env.DB_BRAND == 'mariadb') {
           Db = new MariaDBClient()
       } else if(process.env.DB_BRAD == 'pg') {
           Db = new PgClient()
       }
       Db.init(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME, process.env.DB_HOST, port)
   }
   return Db;
}

export function ApiResp(resp: express.Response, code: string, data?:any, msg?:string) {
    resp.json({code, data, msg})
}

let Db: DBBase;