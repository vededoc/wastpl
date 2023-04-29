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
    userId: string
    userName: string
    token: string
    authType: string
}
export interface SignUpResp {

}
export interface SignInReq {
    userId: string
    password: string
}