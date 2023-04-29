// const {OAuth2Client} = require('google-auth-library')
import {OAuth2Client} from "google-auth-library";
import logger from "./logger";
import {TokenVerifyRes, UserProfile} from "./def";

export class GoogleAuthSvc {
    client: OAuth2Client
    clientId: string
    init(clientId: string) {
        this.clientId = clientId
        this.client = new OAuth2Client(clientId)
    }

    async verify(credential: string): Promise<TokenVerifyRes> {
        logger.info('verify token:', credential)
        const ticket = await this.client.verifyIdToken({
            idToken: credential,
            audience: this.clientId,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        const uf = {} as TokenVerifyRes
        uf.userId = payload.email
        uf.userName = payload.name
        uf.email = payload.email
        uf.exp = new Date(payload.exp * 1000)
        uf.imgUrl = payload.picture
        uf.phoneNumber = null
        uf.address = null
        // uf.phoneNumber
        // const userid = payload['sub'];
        // If request specified a G Suite domain:
        // const domain = payload['hd'];

        // logger.info('verify res:', payload)
        return uf
    }
}

export const gGoogleAuthSvc = new GoogleAuthSvc()
