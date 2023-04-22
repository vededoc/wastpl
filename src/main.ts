require('dotenv').config()

import {gAppCfg, InitApp} from "./app";
import * as os from "os";
const cluster = require('node:cluster')

import gMainProc from "./MainProc";
import logger from "./logger";

InitApp()

process.title = 'wastpl'

if(gAppCfg.clusterCount >0 && cluster.isPrimary) {
    logger.info('main start')
    for(let i=0;i<gAppCfg.clusterCount;i++) {
        cluster.fork()
    }
} else {
    gMainProc.init()
}
