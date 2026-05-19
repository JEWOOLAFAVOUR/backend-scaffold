# skill-1

## Project Mission

Build a backend foundation that is simple enough to learn from, but strong enough to scale into a real production system.

The target stack is:

- Node.js
- TypeScript
- Advanced TypeScript patterns
- PostgreSQL

The long-term goal is not just to ship a template. The goal is to understand the backend so deeply that it can be rebuilt from scratch, explained clearly in interviews, and extended into fintech-grade systems later.

## What This Project Is For

This project is a learning backend that should teach:

- how a Node.js app starts
- how a request enters the system and moves through layers
- how to structure files and folders in a maintainable way
- how to connect PostgreSQL safely
- how to validate input properly
- how to write business logic cleanly
- how to isolate database work
- how to handle background jobs
- how to think about reliability, security, and correctness

This is not only about code. It is about learning the reasoning behind the code.

## Current State

- The workspace was empty.
- `npm init -y` has already been run.
- `package.json` now exists.
- This document is the project anchor so the plan stays stable.

## Learning Rules

- Start small.
- Learn each layer before moving to the next one.
- Do not skip the reason behind any folder or file.
- Do not memorize blindly; understand the job of each piece.
- Build one full path at a time: route, controller, service, repository, database.
- Revisit concepts until they feel natural.

## Core Backend Mental Model

A backend is usually a chain of responsibilities.

Request flow:

1. Client sends a request.
2. Route matches the URL.
3. Middleware runs if needed.
4. Controller receives the request.
5. Controller passes data to a service.
6. Service applies business rules.
7. Service calls a repository if data is needed.
8. Repository talks to the database.
9. Service returns the result.
10. Controller sends the response.
11. Error handler catches failures if something breaks.

That flow is the backbone of the project.

## Standard Folder Structure

The structure below is the working target for this project.

```text
src/
|
├── config/
├── controllers/
├── services/
├── repositories/
├── models/
├── routes/
├── middlewares/
├── validators/
├── utils/
├── queues/
├── workers/
├── events/
├── jobs/
├── database/
├── types/
├── constants/
├── logs/
├── tests/
|
├── app.ts
└── server.ts
```

## What Each Folder Does

### `src/config/`

Holds application settings and connection setup.

Typical contents:

- environment variable loader
- database connection config
- Redis config
- email config
- external service config

Why it exists:

- keeps setup code in one place
- avoids hardcoding values throughout the app
- makes the app easier to configure per environment

### `src/controllers/`

Handles the HTTP layer.

What controllers do:

- read data from `req`
- call services
- return responses

What controllers should not do:

- contain heavy business rules
- query the database directly
- become too large

Think of a controller as the translator between HTTP and application logic.

### `src/services/`

Contains business logic.

What services do:

- decide what should happen
- coordinate multiple operations
- apply business rules
- manage transactions when needed

What services should not do:

- know about Express response objects
- become direct HTTP handlers

This is one of the most important folders in the whole project.

### `src/repositories/`

Handles data access.

What repositories do:

- read from the database
- insert records
- update records
- delete records
- return data to services

What repositories should not do:

- decide business policy
- format HTTP responses
- contain controller logic

Repositories keep database logic clean and reusable.

### `src/models/`

Defines data shapes or ORM models.

This folder may contain:

- database entities
- schema definitions
- domain models

Depending on the ORM or database tool, this folder may be light or more important.

### `src/routes/`

Maps URLs to controller methods.

Example:

- `POST /users` -> create user controller
- `GET /users/:id` -> fetch user controller

Routes are the entry map for the API.

### `src/middlewares/`

Contains logic that runs before or around route handlers.

Examples:

- authentication middleware
- authorization middleware
- request logging middleware
- rate limiting middleware
- error handling middleware

Middleware is where cross-cutting concerns live.

### `src/validators/`

Checks input before business logic runs.

Examples:

- body validation
- query validation
- params validation

This folder prevents bad input from entering the app.

### `src/utils/`

Holds small reusable helper functions.

Examples:

- date formatting
- ID formatting
- small shared helper functions

Important rule:

- do not put business logic here
- keep it for general-purpose utilities

### `src/queues/`

Defines background job queues.

Used for tasks that should happen later, not during the request.

Examples:

- send email after signup
- generate reports
- process payment-related follow-up tasks

### `src/workers/`

Processes jobs from queues.

Workers run background tasks outside the main request flow.

Examples:

- email worker
- notification worker
- reconciliation worker

### `src/events/`

Holds event definitions and event handlers.

Use this when one action should trigger another action without tight coupling.

Example:

- user registered event triggers welcome email and audit log

### `src/jobs/`

Contains scheduled or background tasks.

Examples:

- daily reconciliation
- cleanup jobs
- retry jobs
- scheduled reports

### `src/database/`

Holds database-related code that is not just raw config.

Examples:

- migrations
- seeders
- transaction helpers
- database bootstrap code

### `src/types/`

Contains shared TypeScript types and interfaces.

Examples:

- request types
- response types
- DTO types
- common interfaces

This folder is very important in a TypeScript project.

### `src/constants/`

Holds fixed values used across the app.

Examples:

- role names
- error messages
- status values
- default limits

This prevents magic values from being scattered through the code.

### `src/logs/`

Holds logging setup or log output-related files.

Logging is important for debugging, monitoring, and production support.

### `src/tests/`

Holds automated tests.

Tests may include:

- unit tests
- integration tests
- end-to-end tests

Testing proves the backend behaves as expected.

### `src/app.ts`

Sets up the application.

Usually contains:

- middleware registration
- route registration
- error handler setup

This file builds the Express or server app instance.

### `src/server.ts`

Starts the server.

Usually contains:

- database connection startup
- app listen call
- startup logging

This is the entry point that actually runs the backend.

## How the Layers Connect

Use this sequence as the mental model for every feature:

```text
route -> middleware -> controller -> service -> repository -> database
```

Example with a user registration endpoint:

- route receives `POST /users`
- validation middleware checks the body
- controller extracts the request data
- service checks whether the email already exists
- service hashes the password
- service calls the repository to save the user
- repository writes to PostgreSQL
- controller returns the response

If you understand this flow, you understand the shape of most backend APIs.

## How a Feature Should Be Built

When adding a new feature, follow this order:

1. Define the route.
2. Define the validator.
3. Add the controller method.
4. Add the service method.
5. Add the repository method if database work is needed.
6. Add types if needed.
7. Add tests.

This order keeps the feature clean and predictable.

## TypeScript Concepts To Learn Well

TypeScript is not only for syntax safety. It is part of the design.

Important ideas:

- types and interfaces
- union types
- intersection types
- generics
- type narrowing
- enums or constant objects
- utility types
- function typing
- request and response typing

Why this matters:

- it helps you catch mistakes early
- it makes code easier to understand
- it makes backend layers safer and more explicit

## PostgreSQL Concepts To Learn Well

PostgreSQL is not just a storage engine. It is the data foundation.

Important ideas:

- tables
- columns and types
- primary keys
- foreign keys
- indexes
- joins
- transactions
- constraints
- migrations
- isolation levels

For fintech-style systems, PostgreSQL matters a lot because correctness and consistency are critical.

## Validation Concepts

Validation checks that input is valid before business logic runs.

You should learn:

- required fields
- string length checks
- number limits
- email format checks
- enum/value checks
- params and query validation

Why validation matters:

- protects your service layer
- gives clear error messages
- reduces bugs and bad data

## Error Handling Concepts

Backend code must fail in a controlled way.

Error handling should:

- catch expected failures
- return clean responses
- hide unnecessary internal details
- preserve useful logs for debugging

Important ideas:

- custom errors
- global error middleware
- status codes
- safe error messages

## Logging Concepts

Logging helps you understand what happened in the system.

You should log:

- startup success
- errors
- critical actions
- external API failures

Good logging is very important for production and fintech work.

## Authentication And Authorization

These are different ideas:

- authentication means who you are
- authorization means what you are allowed to do

Examples:

- login checks identity
- role checks permissions

These usually live in middleware and services.

## Queues and Workers

Some tasks should not block the user request.

Use queues and workers for:

- emails
- notifications
- file processing
- reconciliation jobs
- retries

Why this matters:

- keeps the API fast
- improves reliability
- avoids long request times

## Events and Jobs

Events and jobs help when work should happen after an action or on a schedule.

Events are good for:

- decoupling actions
- triggering side effects

Jobs are good for:

- scheduled work
- batch processing
- maintenance tasks

## Testing Concepts

Testing proves the app behaves correctly.

What to test:

- services
- repositories
- validators
- controllers
- request flows

Why testing matters:

- catches regressions
- builds confidence
- is essential for serious backend work

## Fintech Mindset

The fintech mindset is about correctness, traceability, and safety.

Important ideas:

- transactions must be reliable
- operations should not duplicate money movement
- retry logic should be safe
- every important action should be traceable
- reconciliation should be possible
- audit logs should exist

You do not need to master fintech concepts immediately, but this project should keep that mindset from the beginning.

## What “Solid Backend” Means Here

A solid backend should:

- be easy to read
- separate concerns properly
- be easy to test
- handle errors cleanly
- support growth
- protect data integrity
- support background processing
- use TypeScript well
- connect to PostgreSQL correctly

## Step-by-Step Build Roadmap

Use this as the learning path for the project.

1. Initialize the Node.js project.
2. Add TypeScript.
3. Add linting and formatting.
4. Create the base folder structure.
5. Build `app.ts` and `server.ts`.
6. Add routes and controllers.
7. Add services and repositories.
8. Add validation.
9. Add error handling.
10. Add PostgreSQL integration.
11. Add migrations.
12. Add authentication and authorization.
13. Add logging.
14. Add tests.
15. Add queues and workers.
16. Add scheduled jobs.
17. Add fintech-style reliability patterns like transactions and idempotency.

## What We Should Not Do

- Do not skip the basics.
- Do not build folders without understanding them.
- Do not mix HTTP code with business logic.
- Do not mix database access with controllers.
- Do not rush into advanced patterns before the foundation is clear.

## Working Agreement For This Project

- Keep every step simple.
- Explain concepts in plain language.
- Build the project in layers.
- Make the structure reusable and production-minded.
- Keep the fintech angle in mind, but do not let it obscure the foundation.

## Why This Document Exists

This file is the project memory.

If the conversation starts drifting, this document should bring the work back to:

- the goal
- the structure
- the concepts
- the step-by-step build order

This is the anchor for the backend training path.
