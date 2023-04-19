require('dotenv').config()

import * as os from "os";
const cluster = require('node:cluster')

import gMainProc from "./MainProc";
import logger from "./logger";

process.title = 'wastpl'
const {CLUSTER_COUNT} = process.env
const clusterCnt = CLUSTER_COUNT != undefined ? Number.parseInt(CLUSTER_COUNT) : os.cpus().length

if(clusterCnt >0 && cluster.isPrimary) {
    logger.info('main start')
    for(let i=0;i<clusterCnt;i++) {
        cluster.fork()
    }
} else {
    gMainProc.init()
}
