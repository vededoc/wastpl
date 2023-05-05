import {IncomingHttpHeaders} from "http";

/**
 * extract token from Authorization header value of incoming request
 *
 * @param headers - headers of incoming http request
 * @return - token extracted from Authorization header value
 */
export function GetJwtToken(headers: IncomingHttpHeaders): string {
    const hv = headers.authorization?.split(' ')
    if(!hv || hv[0] != 'Bearer' || hv.length != 2) {
        return undefined
    }
    return hv[1]
}
