# Todo API

A RESTful API built with NestJS for managing todo items.

## Description

This project is a Todo API built using [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient and scalable server-side applications.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Runtime**: Node.js
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Start development server: `npm run start:dev`
5. Visit http://localhost:3000

## Running the db

1. Run `docker compose up`
2. Run `npx drizzle-kit migrate`
