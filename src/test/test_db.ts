require('dotenv').config({path: '../../.env'})

import {gAppCfg, GetDb, InitApp} from "../app";
import * as YAML from 'yaml'

(async ()=>{
    InitApp()

    const db = GetDb()
    const services = await db.retrieveServices()
    console.info('services:\n', YAML.stringify(services))
})()
