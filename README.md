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

## API Endpoints

### Authentication

#### Register

- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string" // minimum 6 characters
  }
  ```
- **Response**: User data with JWT token

#### Login

- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**: User data with JWT token

#### Get Profile

- **GET** `/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Current user profile

### Todos

_All todo endpoints require authentication (Bearer token)_

#### Create Todo

- **POST** `/todos`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "string"
  }
  ```
- **Response**: Created todo object

#### Get All Todos

- **GET** `/todos`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of todo objects with tasks

### Tasks

_All task endpoints require authentication (Bearer token)_

#### Create Task

- **POST** `/tasks`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "todoId": "uuid",
    "title": "string",
    "description": "string" // optional
  }
  ```
- **Response**: Created task object

#### Update Task

- **PATCH** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Body** (all fields optional):
  ```json
  {
    "title": "string",
    "description": "string",
    "completed": boolean,
    "position": "string" // for reordering
  }
  ```
- **Response**: Updated task object

##### Position Reordering

The `position` field allows you to reorder tasks within a todo list. The system uses fractional positioning for smooth reordering:

- **How it works**: Tasks are ordered by their position value (ascending order)
- **Position format**: String representation of a decimal number (e.g., "1", "2.5", "10")
- **Automatic positioning**: When creating a new task, it automatically gets the next highest position
- **Reordering logic**:
  - When you specify a target position, the system calculates a new position between existing tasks
  - If moving between position 1 and 3, the new position might be "2"
  - If moving between position 2 and 3, the new position might be "2.5"
  - This prevents the need to update all other tasks when reordering

**Examples**:

```json
// Move task to position 5
{
  "position": "5"
}

// Move task between existing positions (system will calculate optimal position)
{
  "position": "2.5"
}

// Move task to the beginning
{
  "position": "0.5"
}
```

**Note**: You don't need to calculate exact fractional positions - the system automatically handles positioning between existing tasks to maintain proper order.

#### Delete Task

- **DELETE** `/tasks/:id`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Success message

#### Get Tasks by Todo ID

- **GET** `/tasks/todo/:todoId`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Array of tasks for the specified todo

### Response Formats

#### Todo Response

```json
{
  "id": "uuid",
  "title": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "tasks": [TaskResponse] // optional
}
```

#### Task Response

```json
{
  "id": "uuid",
  "todoId": "uuid",
  "title": "string",
  "description": "string",
  "completed": boolean,
  "position": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```
