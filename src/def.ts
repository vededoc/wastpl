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