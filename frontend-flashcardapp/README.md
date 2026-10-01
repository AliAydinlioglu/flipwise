# FlipWise Frontend

The single-page client application for the FlipWise flashcard platform, built with React 18, Vite, and Material-UI (MUI).

---

## 📁 Directory Structure

```
frontend-flashcardapp/
├── cypress/             # Cypress E2E test suites and test fixtures
│   ├── e2e/             # Auth, folder management, study mode, and navigation tests
│   └── fixtures/        # Mock test data
├── src/
│   ├── api/             # Axios instance, Bearer token interceptor, and API call helpers
│   ├── components/      # Reusable UI components (Navbar, Loader, ErrorBoundary, PrivateRoute)
│   ├── constants/       # Color palettes, gradients, and styling constants
│   ├── contexts/        # React contexts (Auth.context.jsx for login state, Theme.context.jsx)
│   ├── pages/           # Application views:
│   │   ├── HomePage.jsx       # Landing page & feature highlights
│   │   ├── StudyMode.jsx      # Interactive flashcard study interface
│   │   ├── PublicFolders.jsx  # Community decks browser
│   │   ├── MyFolders.jsx      # Authenticated user deck dashboard
│   │   ├── FolderDetail.jsx   # Folder inspection and card listing
│   │   ├── CreateFolder.jsx   # New folder creation form
│   │   ├── CreateCard.jsx     # New flashcard creation form
│   │   ├── LoginPage.jsx      # User authentication
│   │   └── About.jsx          # App overview
│   ├── App.jsx          # Route definitions and layout assembly
│   ├── main.jsx         # React application entry point
│   └── index.css        # Global CSS styles
├── vite.config.js       # Vite build configuration
└── package.json         # Dependencies and scripts
```

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **UI Components:** Material-UI (MUI v6), Emotion
- **Routing:** React Router v6
- **Data Fetching:** Axios, SWR
- **Forms:** React Hook Form
- **End-to-End Testing:** Cypress

---

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 20.6.0)
- Yarn (>= 4.4.0)
- Running FlipWise Backend API (`http://localhost:9000/api`)

### 1. Installation

```bash
cd frontend-flashcardapp
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the `frontend-flashcardapp/` directory:

```env
VITE_API_URL=http://localhost:9000/api
```

### 3. Running the App

* **Start development server:**
  ```bash
  yarn dev
  ```
  App will run on `http://localhost:5173`.

* **Build for production:**
  ```bash
  yarn build
  ```

* **Preview production build:**
  ```bash
  yarn preview
  ```

* **Run linter:**
  ```bash
  yarn lint
  ```

---

## 🧪 Testing

Run Cypress end-to-end tests:

* **Interactive test runner (browser UI):**
  ```bash
  yarn test:live
  ```

* **Headless test execution:**
  ```bash
  yarn test
  ```
