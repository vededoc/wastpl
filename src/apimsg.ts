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
    serviceId: string
    uid: number
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
    serviceId: string
    userId?: string
    password?: string
    authType: string
    credential: string
}