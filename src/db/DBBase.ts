import {ServiceProfileRec, UserProfileRec} from "./dbrecord";

export abstract class DBBase {
    abstract init(user: string, password: string, database: string, host: string, port?: number)
    abstract getUser(userId: string): Promise<UserProfileRec>
    abstract apiLog(urlPath:string, msg: any): Promise<any>
    abstract newService(ServiceProfileRec): Promise<number>
    abstract removeService(serviceId: string): Promise<number>
    abstract updateService(service: ServiceProfileRec): Promise<number>
    abstract getService(serviceId: string): Promise<ServiceProfileRec>
    abstract changeServiceStatus(serviceId: string, status: number): Promise<number>
    abstract retrieveServices(): Promise<ServiceProfileRec[]>
    abstract deleteApiLog(ct: Date): Promise<number>
    abstract addUser(uf: UserProfileRec): Promise<any>
}