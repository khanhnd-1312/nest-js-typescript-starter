# RealWorld API — NestJS

Backend implementation of the [RealWorld](https://realworld-docs.netlify.app) spec using NestJS, TypeORM, and PostgreSQL.

## Tech Stack

- **Framework:** NestJS + TypeScript
- **Database:** PostgreSQL (Docker)
- **ORM:** TypeORM (migrations)
- **Auth:** JWT + Passport
- **Docs:** Swagger UI (`/api/docs`)

## Requirements

- Node.js 22+
- pnpm
- Docker

## Getting Started

```bash
# 1. Copy env file and fill in values
cp .env.example .env

# 2. Install dependencies + start database
make setup

# 3. Run migrations
make migrate

# 4. Start app in watch mode
make dev
```

App chạy tại: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api/docs`

## Available Commands

```bash
make help            # Show all command
make up              # Start all dependent containers (include database)
make down            # Stop all dependent containers (include database)
make dev             # Run app in dev mode
make build           # Build production
make migrate         # Run pending migrations
make migrate-revert  # Revert previous migration
make migrate-show    # Show all migration status
make test            # Unit tests
make test-e2e        # E2E tests
make test-cov        # Tests + coverage
make db              # Open psql in database
```

## Project Structure

```
src/
├── migrations/        # TypeORM migration files
├── modules/
│   ├── users/         # Auth + User profile
│   ├── articles/      # Articles + Favorites + Tags
│   └── comments/      # Comments
├── data-source.ts     # TypeORM CLI config
└── main.ts
```

## Environment Variables

Check [.env.example](.env.example) for needed environment variables.
