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