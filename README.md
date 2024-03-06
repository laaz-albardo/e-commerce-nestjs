<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

<h1 align="center">E-Commerce Nestjs Documentation</h1>

## Description

E-commerce project for professional and practical use, using current technologies and api's.


## Installation

```bash
$ pnpm install or npm install
```

## Set Enviroments
crear archivo .env en la ruta raiz del sistema y configurar las siguiente variables para el funcionamiento del sistema.

```bash
# Node.js server configuration
SERVER_PORT=8000

# Sincronize true only with MongoDB
MONGODB_HOST=localhost         # Default localhost
MONGODB_PORT=27017             # Default port 27017
MONGODB_DBNAME=dbname
MONGODB_DBTEST=dbtest
MONGODB_USER=username
MONGODB_PASSWORD=password
```

## Running the app

```bash
# development
$ pnpm run start or npm run start

# watch mode
$ pnpm run dev or npm run dev
```

## Running Seeds

```bash
# run seed
$ pnpm run seed or npm run seed

# drop schema and run seed
$ pnpm run seed:refresh or npm run seed:refresh
```

### WARNING
**Si se quiere usar en produccion se debe de configurar la variable de entorno primero y luego usar el comando para su uso correcto**

Por defecto esta estara como development

```bash
# Set to production when deploying to production
NODE_ENV=production
```

Luego ya puedes el siguiente comando
```bash
# production mode
$ pnpm run start:prod or npm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).