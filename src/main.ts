import {program} from "commander";

require('dotenv').config()

const cluster = require('node:cluster')

import * as YAML from 'yaml'
import {gAppCfg, InitApp} from "./app";

import gMainProc from "./MainProc";
import logger, {GetLogLevel, SetLogLevel} from "./logger";
import gScheduler from "./Scheduler";
import axios from "axios";
import {MGMT_PATH} from "./apimsg";


async function ProcCtrlCmd() {
    const opts = program.opts()
    const cmdUrl = `http://127.0.0.1:${gAppCfg.servicePort}${gAppCfg.basePath}${MGMT_PATH}`
    if(opts.logLevel != undefined) {
        if(opts.logLevel === true) {
            const res = await axios.get(cmdUrl + '/logLevel')
            console.info(res.data.data.level)
        } else {
            const res = await axios.post(cmdUrl + '/logLevel', {level: opts.logLevel})
            console.info(res.data.code)
        }
    }
    process.exit(0)
}

async function Main() {
    if(!gAppCfg.scheduler) {
        process.title = gAppCfg.pkgName
        const opts = program.opts()
        if(opts.logLevel != undefined) {
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