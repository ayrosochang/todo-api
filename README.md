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

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

- `NODE_ENV` - Environment (development, production)
- `PORT` - Port number (default: 3000)
- `CORS_ORIGIN` - CORS origin URL

## Project Structure

```
src/
├── app.controller.ts    # Main application controller
├── app.module.ts        # Root module
├── app.service.ts       # Main application service
└── main.ts             # Application entry point
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

## License

This project is [MIT licensed](LICENSE).