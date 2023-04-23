require('dotenv').config()

const cluster = require('node:cluster')

import * as YAML from 'yaml'
import {gAppCfg, InitApp} from "./app";
import * as os from "os";

import gMainProc from "./MainProc";
import logger from "./logger";
import gScheduler from "./Scheduler";

InitApp()

if(!gAppCfg.scheduler) {
    process.title = 'wastpl'

    if (gAppCfg.clusterCount > 0 && cluster.isPrimary) {
        logger.info('main start')
        logger.info('config:', YAML.stringify(gAppCfg))
        for (let i = 0; i < gAppCfg.clusterCount; i++) {
            cluster.fork()
        }

        process.on('SIGTERM', ()=> {
            console.info('on SIGTERM')
            process.exit(0)
        })
        process.on('SIGINT', ()=> {
            console.info('on SIGINT')
            process.exit(0)
        })

    } else {
        gMainProc.init()
    }

} else {
    process.title = 'was-scheduler'
    logger.info('run as scheduler')

    gScheduler.init();

    process.on('SIGTERM', ()=> {
        console.info('on SIGTERM')
        process.exit(0)
    })
    process.on('SIGINT', ()=> {
        console.info('on SIGINT')
        process.exit(0)
    })
}