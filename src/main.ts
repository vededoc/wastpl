require('dotenv').config()

import * as YAML from 'yaml'
import {gAppCfg, InitApp} from "./app";
import * as os from "os";
const cluster = require('node:cluster')

import gMainProc from "./MainProc";
import logger from "./logger";

InitApp()

process.title = 'wastpl'

if(gAppCfg.clusterCount >0 && cluster.isPrimary) {
    logger.info('main start')
    logger.info('config:', YAML.stringify(gAppCfg))
    for(let i=0;i<gAppCfg.clusterCount;i++) {
        cluster.fork()
    }
} else {
    gMainProc.init()
}
