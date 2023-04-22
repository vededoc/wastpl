export const CAPI_PATH = '/capi'
export const ADMIN_PATH = '/admin'
export const OAPI_PATH = '/oapi'

export interface BaseResp {
    code: string
    msg?: string
    data?: any
}

export interface GetUserReq {
    userId: string
}

export interface SignInReq {
    userId: string
    password: string
}