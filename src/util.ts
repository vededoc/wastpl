import {IncomingHttpHeaders} from "http";

export function GetJwtToken(headers: IncomingHttpHeaders) {
    const hv = headers.authorization?.split(' ')
    if(!hv || hv[0] != 'Bearer' || hv.length != 2) {
        return undefined
    }
    return hv[1]
}
