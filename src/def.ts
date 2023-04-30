import {JwtPayload} from "jsonwebtoken";
import {UserProfileRec} from "./db/dbrecord";

export const ErrCode = {
    ok: 'OK',
    notFound: 'NOT_FOUND',
    badRequest: 'BAD_REQUEST',
    authFail: 'AUTH_FAIL',
    duplicated: 'DUPLICATED',
    invalid: 'INVALID',
    dataError: 'DATA_ERROR',
    error: 'ERROR',
}

export interface ServicePolicy {

}

export interface UserProfile {
    userId: string
    userName: string
    phoneNumber: string
    address?: string
    email: string
    imgUrl: string

}
export interface TokenVerifyRes extends UserProfile {
    email: string
    exp: Date
}

export interface JwtRasPayload extends JwtPayload{
    userId: string
    userName: string
}
