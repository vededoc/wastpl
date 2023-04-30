require('dotenv').config()

import {program} from "commander";

const cluster = require('node:cluster')

import * as YAML from 'yaml'
import {gAppCfg, InitApp} from "./app";

import gMainProc from "./MainProc";
import logger, {GetLogLevel, SetLogLevel} from "./logger";
import gScheduler from "./Scheduler";
import {ProcCtrlCmd} from "./AppCmd";



async function Main() {
    if(!gAppCfg.scheduler) {
        process.title = gAppCfg.pkgName
        const opts = program.opts()
        if(opts.logLevel != undefined || opts.genKeys) {
            await ProcCtrlCmd()
            process.exit(0)
        }

        if (gAppCfg.clusterCount > 0 && cluster.isPrimary) {
            logger.info('main start')
            logger.info('config:', YAML.stringify(gAppCfg))
            for (let i = 0; i < gAppCfg.clusterCount; i++) {
                cluster.fork()
            }
        } else {
            if(gAppCfg.clusterCount == 0) {
                logger.info('config:', YAML.stringify(gAppCfg))
            }
            gMainProc.init()
        }
    } else {
        process.title = `${gAppCfg.pkgName}_sched`
        logger.info('run as scheduler')

        gScheduler.init();
    }
}

process.on('SIGTERM', ()=> {
    console.info('on SIGTERM')
    process.exit(0)
})
process.on('SIGINT', ()=> {
    console.info('on SIGINT')
    process.exit(0)
})

InitApp()
SetLogLevel(gAppCfg.logLevel)
Main().catch( err => { console.trace(err)})