import {SignInReq, SignUpReq} from '../../src/apimsg'
declare const google: any
// const axios = require('axios')
import axios from 'axios'

const apiBase = 'http://localhost:19000/was/v1/capi'
class GoogleAuth {
    loaded: boolean = false

    init(clientId: string) {
        if(this.loaded) {
            return;
        }
        this.loaded = true
        const handleCredentialResponse = async (response: any) => {
            console.info('on handle response,', response)
            const responsePayload = this.parseJwt(response.credential)
            console.info('payload:', responsePayload)
            console.log("ID: " + responsePayload.sub);
            console.log('Full Name: ' + responsePayload.name);
            console.log('Given Name: ' + responsePayload.given_name);
            console.log('Family Name: ' + responsePayload.family_name);
            console.log("Image URL: " + responsePayload.picture);
            console.log("Email: " + responsePayload.email);
            const rqm: SignInReq = {
                serviceId: 'testsvc',
                authType: 'google',
                credential: response.credential
            }
            const axcl = axios.create({
                baseURL: apiBase
            })
            axcl.post('/signIn', rqm).then( response => {
                    console.info('response:', response.data)
                const {token} = response.data.data
                axcl.post('/getUser', {serviceId:'testsvc'}, {
                    headers: {Authorization: `Bearer ${token}`}
                })
            })
        }
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse
        });
        // google.accounts.id.prompt();
    }

    private parseJwt(token: string) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    renderButton() {
        google.accounts.id.renderButton(
            document.getElementById("eid_login_sec"),
            {theme: "outline", size: "large"}  // customization attributes
        );
    }
    prompt() {
        google.accounts.id.prompt()
    }
}

const gGooleAuth = new GoogleAuth()
export default gGooleAuth