declare namespace NodeJS {
    interface ProcessEnv {
        // [key: string]: string | undefined
        DB_HOST: string
        DB_PORT: string
        DB_USER: string
        DB_PASSWORD: string
        BASE_PATH: string
        CLUSTER_COUNT: string
    }
}