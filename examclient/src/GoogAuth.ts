declare const google: any
class GoogleAuth {
    loaded: boolean = false

    init(clientId: string) {
        if(this.loaded) {
            return;
        }
        this.loaded = true
        const handleCredentialResponse = (response: any) => {
            console.info('on handle response,', response)
            const responsePayload = this.parseJwt(response.credential)
            console.log("ID: " + responsePayload.sub);
            console.log('Full Name: ' + responsePayload.name);
            console.log('Given Name: ' + responsePayload.given_name);
            console.log('Family Name: ' + responsePayload.family_name);
            console.log("Image URL: " + responsePayload.picture);
            console.log("Email: " + responsePayload.email);
        }
        google.accounts.id.initialize({
            // client_id: '647588110158-ug20mj9l2vduft645orlk4vi5k2eqh3m',
            // client_id: '647588110158-ug20mj9l2vduft645orlk4vi5k2eqh3m.apps.googleusercontent.com',
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
    prompt() {
        google.accounts.id.renderButton(
            document.getElementById("eid_login_sec"),
            { theme: "outline", size: "large" }  // customization attributes
        );
        // google.accounts.id.prompt()
    }
}

const gGooleAuth = new GoogleAuth()
export default gGooleAuth