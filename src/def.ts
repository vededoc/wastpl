import {UserProfileRec} from "./db/dbrecord";

export const ErrCode = {
    ok: 'OK',
    notFound: 'NOT_FOUND',
    badRequest: 'BAD_REQUEST',
    authFail: 'AUTH_FAIL',
    invalidMsg: 'INVALID_MSG',
    dataError: 'DATA_ERROR',
    error: 'ERROR',
}

export interface ServicePolicy {
    maxBitrate: number
    codec: 'h264' | 'av1' |'VP8'
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