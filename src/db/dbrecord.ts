import {ServicePolicy} from "../def";

export interface UserProfileRec {
    userId: string
    password: string
    phoneNumber: string
    signupDate: Date
    address: string
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
}