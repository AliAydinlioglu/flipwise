# FlipWise - Full-Stack Flashcard Learning Application

For an in-depth showcase with screenshots, domain model, and feature walkthrough, see **[dossier.md](dossier.md)**.

---

## 🗂️ Project Structure

This monorepo consists of two independent packages:

* **[`frontend-flashcardapp/`](frontend-flashcardapp/):** The client single-page application built with React 18, Vite, Material-UI, and Cypress.
  * See [Frontend README](frontend-flashcardapp/README.md) for frontend directory details and setup.
* **[`webservices-flashcardapp/`](webservices-flashcardapp/):** The backend RESTful API service built with Node.js, Koa, TypeScript, Knex, and MySQL.
  * See [Backend README](webservices-flashcardapp/README.md) for backend directory details and setup.

---

## ⚡ Quickstart

### Prerequisites

- [Node.js](https://nodejs.org) (v20.6.0 or higher)
- [Yarn](https://yarnpkg.com) (Corepack enabled)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) (v8.x)

---

### 1. Start Backend API Server

```bash
cd webservices-flashcardapp

# Install dependencies
yarn install

# Create environment configuration
# Ensure your local MySQL server is running, then create .env:
cat <<EOF > .env
NODE_ENV=development
PORT=9000
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_NAME=flashcard_dev
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
JWTSECRET=your_secret_key_here
EOF

# Start backend (automatically runs migrations and seeds)
yarn start
```

The API will be available at `http://localhost:9000/api`.

---

### 2. Start Frontend Application

In a separate terminal:

```bash
cd frontend-flashcardapp

# Install dependencies
yarn install

# Create environment configuration:
cat <<EOF > .env
VITE_API_URL=http://localhost:9000/api
EOF

# Start dev server
yarn dev
```

Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Testing

* **Backend Integration Tests:**
  ```bash
  cd webservices-flashcardapp
  yarn test
  ```

* **Frontend E2E Tests (Cypress):**
  ```bash
  cd frontend-flashcardapp
  yarn test:live   # Interactive UI
  yarn test        # Headless
  ```

---

## 📄 License

This project is licensed under the MIT License.
