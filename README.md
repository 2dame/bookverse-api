# bookverse-api

REST API for a book tracking and review application. Handles user authentication, book catalog management, and review workflows with a PostgreSQL backend.

## Stack

- **Runtime:** Node.js + Express
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **ORM/Query:** pg / node-postgres

## Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Authenticate, receive JWT |
| GET | /api/books | List books |
| POST | /api/books | Add book |
| GET | /api/books/:id | Book detail |
| PUT | /api/books/:id | Update book |
| DELETE | /api/books/:id | Remove book |
| GET | /api/reviews | List reviews |
| POST | /api/reviews | Submit review |

## Setup

**Prerequisites:** Node.js 18+, PostgreSQL running locally

```bash
git clone https://github.com/2dame/bookverse-api.git
cd bookverse-api
npm install
cp .env.example .env   # fill in your values
npm run db:migrate     # set up schema
npm start
```

Environment variables are documented in `.env.example`. Do not commit `.env`.

## Architecture

Stateless API with JWT middleware on protected routes. Auth token is validated per-request — no session storage. Database connection uses pooling via `pg.Pool`.

Route structure follows controller pattern: router → middleware (auth/validation) → controller → response.

## Notes

Built as part of the IBM Full Stack Software Developer certification. Focus was end-to-end ownership: schema design, auth implementation, error handling, and deployment configuration.
