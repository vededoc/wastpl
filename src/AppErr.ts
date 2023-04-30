export class AppErr extends Error {
    code: string
    constructor(code: string, message?: string) {
        super(message);
        this.code = code
    }
}