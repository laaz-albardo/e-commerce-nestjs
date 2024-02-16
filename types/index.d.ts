//NodeJS.ProcessEnv

declare namespace NodeJS {
  interface ProcessEnv {
    PRODUCT_NAME: string;
    AUTHORIZATION: boolean;
    ENCRYPTION_DEFAULT: string;
    TZ: string;
    NODE_ENV: string;
    SERVER_PORT: number;
    SERVER_TEST_PORT: number;
    MONGODB_HOST: string;
    MONGODB_PORT: number;
    MONGODB_DBNAME: string;
    MONGODB_DBTEST: string;
    MONGODB_USER: string;
    MONGODB_PASSWORD: string;
  }
}
