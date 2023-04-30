import {program} from "commander";
import {gAppCfg} from "./app";
import {MGMT_PATH} from "./apimsg";
import axios from "axios";

export async function ProcCtrlCmd() {
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
    } else if(opts.genKeys) {
        try {
            let bits: number;
            if(opts.genKeys === true) {
                bits = 512
            } else {
                bits = Number.parseInt( opts.genKeys )
            }
            if( ![512, 1024, 2048].includes(bits)) {
                console.error('invalid bits')
                process.exit(1)
            }

            const forge = require('node-forge');
            const pki = forge.pki;
            const keys = pki.rsa.generateKeyPair({bits});
            const publicPem = pki.publicKeyToPem(keys.publicKey)
            const privPem = pki.privateKeyToPem(keys.privateKey)
            console.info('privKey:')
            console.info(privPem.toString())
            console.info('publicKey:')
            console.info(publicPem.toString())
        } catch (err) {
            console.error(err)
            process.exit(1)
        }
    }
    process.exit(0)
}
