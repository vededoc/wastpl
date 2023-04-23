import { EventEmitter } from 'node:events'
import Redis from "ioredis";
import logger from "./logger";
import {SEC_MS} from "@vededoc/sjsutils";
import {gAppCfg} from "./app";

const WAS_REDIS_CHANNEL = 'was:ch1'

interface ChannelMsg {
    event: 'serviceChanged' | 'general'
    serviceId?: string
    version?: number
}

class WasRedis {
    redis: Redis
    chUpdateEvt: EventEmitter
    apiUpdateEvt: EventEmitter
    cnnEvt: EventEmitter
    pubRedis: Redis;
    checkTimer: NodeJS.Timer

    constructor() {
        this.redis = new Redis({
            host: gAppCfg.redisHost,
            username: gAppCfg.redisUser,
            password: gAppCfg.redisPassword,
            db: gAppCfg.redisDb
        })
        this.pubRedis = new Redis({
            host: gAppCfg.redisHost,
            username: gAppCfg.redisUser,
            password: gAppCfg.redisPassword,
            db: gAppCfg.redisDb
        })
        this.apiUpdateEvt = new EventEmitter()
        this.chUpdateEvt = new EventEmitter()
        this.cnnEvt = new EventEmitter();

    }

    private startCnnCheckTimer() {
        if(this.checkTimer) {
            return;
        }
        const timer = setInterval(()=>{
            console.log(this.redis?.status)
            if(this.redis.status == 'ready') {
                logger.info('redis connected')
                clearInterval(timer)
                this.checkTimer = null;
                this.cnnEvt.emit('connection', 'reconnected')

            }
        }, SEC_MS)
        this.checkTimer = timer;
    }

    private stopCheckTimer() {
        if(this.checkTimer) {
            clearInterval(this.checkTimer)
            this.checkTimer = undefined;
        }
    }

    public init() {
        this.redis.on('error', err => {
            console.log('error cb:', err)
            if(!err) {
                logger.info('*** no error')
            }
            if(err['code'] == 'ECONNREFUSED') {
                logger.info('### cnn refused')
                this.startCnnCheckTimer();
            }
        })


        this.redis.subscribe(WAS_REDIS_CHANNEL, (err: Error, cnt) => {
            logger.info('subscribe cb, cnt=%d', cnt);
            if(err) {
                logger.info('### SUBS Error:', err)
            }

        })
        this.redis.on('message', (channel, message) => {
            logger.info('channel=%s, message=%s', channel, message)
            if(channel != WAS_REDIS_CHANNEL) {
                return;
            }
            let chmsg: ChannelMsg
            try {
                chmsg = JSON.parse(message)
            } catch (e) {
                logger.info('###  redis channel message parsing error, err=', e.name)
                return;
            }

            if(chmsg.event == 'serviceChanged') {
                this.apiUpdateEvt.emit('cmsg', chmsg)
            }
            else {
                logger.info('### unknown channel event=%s', chmsg.event)
            }
        })
    }

    public addCnnEvent(cb: (string: number) => void) {
        this.cnnEvt.addListener('connection', cb)
    }

    notifyServiceChanged(serviceId: string) {
        const msg: ChannelMsg = {
            event: 'serviceChanged',
            serviceId,
        }
        this.pubRedis.publish(WAS_REDIS_CHANNEL, JSON.stringify(msg), (err, res) => {
            if(err) {
                console.trace(err)
            }
        })
    }

    listenChannel(cb: (msg: ChannelMsg) => void) {
        this.apiUpdateEvt.addListener('cmsg', cb)
    }

    removeListener(cb) {
        this.apiUpdateEvt.removeListener('cmsg', cb)
    }

}

const wasRedis = new WasRedis()

export default wasRedis