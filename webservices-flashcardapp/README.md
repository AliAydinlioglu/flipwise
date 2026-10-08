# FlipWise Backend (Web Services)

A RESTful API built with Node.js, Koa, TypeScript, and MySQL for the FlipWise flashcard learning platform.

---

## Directory Structure

```
webservices-flashcardapp/
├── config/              # Environment configurations (dev, test, prod) via 'config'
├── src/
│   ├── constants/       # Centralized route endpoints and error codes
│   ├── core/            # Middleware, JWT auth, Argon2 hashing, validation, logging
│   ├── data/            # Knex connection setup, migrations, and seeds
│   │   ├── migrations/  # Database schema migrations
│   │   └── seeds/       # Initial development seed data
│   ├── mappers/         # Data transfer object (DTO) transformations
│   ├── repository/      # Direct database access layer (Knex queries)
│   ├── rest/            # Koa route handlers and request validation (Joi)
│   ├── service/         # Core business logic and permission checks
│   ├── types/           # TypeScript interfaces and types
│   ├── createServer.ts  # Koa app assembly and middleware configuration
│   └── index.ts         # Application entry point
├── __tests__/           # Jest & Supertest integration tests
└── apidoc.json          # Configuration for ApiDoc documentation generator
```

---

## Tech Stack

- **Runtime & Framework:** Node.js, Koa.js, TypeScript
- **Database & Query Builder:** MySQL 8, Knex.js
- **Security:** Argon2 (password hashing), JSON Web Tokens (JWT), Helmet, CORS
- **Validation:** Joi
- **Testing:** Jest, Supertest
- **Logging:** Winston

---

## Getting Started

### Prerequisites

- Node.js (>= 20.6.0)
- Yarn (>= 1.22.0)
- MySQL Server 8.x

### 1. Installation

```bash
cd webservices-flashcardapp
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the `webservices-flashcardapp/` directory:

```env
NODE_ENV=development
PORT=9000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=flashcard_dev
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
JWTSECRET=your_jwt_secret_key_here
```

For running tests, optionally create a `.env.test` file pointing to a dedicated test database (e.g., `flashcard_test`).

### 3. Running the Server

* **Development mode (TypeScript via ts-node):**
  ```bash
  yarn start
  ```
  *(Migrations and seeds run automatically upon startup in development mode)*

* **Development with Nodemon (auto-reload):**
  ```bash
  yarn startDemon
  ```

* **Reset and re-seed the database:**
  ```bash
  yarn start reset
  ```

* **Compile TypeScript to JavaScript:**
  ```bash
  yarn tsc
  ```

* **Run compiled JavaScript:**
  ```bash
  yarn startJS
  ```

---

## Testing

Run the integration test suite:

```bash
yarn test
```

Run tests with test coverage reporting:

```bash
yarn test:coverage
```

---

## API Documentation

Generate API documentation using ApiDoc:

```bash
yarn docs:build
yarn docs:open
```
