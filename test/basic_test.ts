import axios from "axios";
import logger from "../src/logger";

(async () => {
    const ax = axios.create({
        baseURL: 'http://localhost:19000/was/v1'
    })
    const res = await ax.post('/capi/signUp')
    logger.info(res.data)
})()