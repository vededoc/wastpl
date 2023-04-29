import gGooleAuth from "./GoogAuth";


function handleCredentialResponse(token: any) {
    console.log('on handle resp')
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.onload = function () {
    console.info('google client id:', process.env.GOOGLE_CLIENT_ID)
    // gGooleAuth.init('647588110158-ug20mj9l2vduft645orlk4vi5k2eqh3m.apps.googleusercontent.com')
    gGooleAuth.init(process.env.GOOGLE_CLIENT_ID)
    {
        const btn = document.querySelector('#eid_google_login') as HTMLButtonElement
        btn.onclick = evt => {
            gGooleAuth.prompt()
        }
    }
};