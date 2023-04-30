import {ServicePolicy, UserProfile} from "../def";

export interface UserProfileRec extends UserProfile {
    uid: number
    authType: string
    serviceId: string
    password: string
    signupDate: Date
    status: string
}

export interface ServiceProfileRec {
    serviceId: string
    apiKey: string
    status: number
    updateDate: Date
    registeredDate: Date
    description: string
    policies: ServicePolicy
    privKey: string
    publicKey: string
}