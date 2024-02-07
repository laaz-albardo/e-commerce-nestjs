//NodeJS.ProcessEnv

declare namespace NodeJS {
  interface ProcessEnv {
    PRODUCT_NAME: string;
    AUTHORIZATION: boolean;
    ENCRYPTION_DEFAULT: string;
    TZ: string;
    NODE_ENV: string;
    SERVER_PORT: number;
  }
}
