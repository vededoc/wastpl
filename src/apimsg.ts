export const CAPI_PATH = '/capi'
export const SAPI_PATH = '/sapi'
export const MGMT_PATH = '/mgmt'
export const OAPI_PATH = '/oapi'

export interface BaseResp {
    code: string
    msg?: string
    data?: any
}

export interface GetUserReq {
    userId: string
}

export interface SignUpReq {
    serviceId: string
    userId?: string
    userName?: string
    credential: string
    authType: string // 'google' | 'email'
}
export interface SignUpResp {

}
export interface SignInReq {
    userId: string
    password: string
}