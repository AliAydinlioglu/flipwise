import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/Auth.context.jsx";
import { ThemeProvider } from "./contexts/Theme.context.jsx";

import Layout from "./pages/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import LogoutPage from "./pages/LogoutPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CreateFolder from "./pages/CreateFolder.jsx";
import EditFolder from "./pages/EditFolder.jsx";
import CreateCard from "./pages/CreateCard.jsx";
import EditCard from "./pages/EditCard.jsx";
import FolderDetail from "./pages/FolderDetail.jsx";
import StudyMode from "./pages/StudyMode.jsx";
import MyFolders from "./pages/MyFolders.jsx";
import PublicFolders from "./pages/PublicFolders.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="login"
              element={<LoginPage />}
            />
            <Route
              path="register"
              element={<RegisterPage />}
            />
            <Route
              path="public-folders"
              element={<PublicFolders />}
            />
            <Route
              path="folders/:folderId/study"
              element={<StudyMode />}
            />

            <Route
              path="/"
              element={<Layout />}
            >
              <Route
                path="logout"
                element={<LogoutPage />}
              />
              <Route
                path="about"
                element={<About />}
              />
              <Route
                path="folders"
                element={
                  <PrivateRoute>
                    <MyFolders />
                  </PrivateRoute>
                }
              />
              <Route
                path="folders/create"
                element={
                  <PrivateRoute>
                    <CreateFolder />
                  </PrivateRoute>
                }
              />
              <Route
                path="folders/:folderId/edit"
                element={
                  <PrivateRoute>
                    <EditFolder />
                  </PrivateRoute>
                }
              />
              <Route
                path="folders/:folderId"
                element={<FolderDetail />}
              />
              <Route
                path="folders/:folderId/cards/create"
                element={
                  <PrivateRoute>
                    <CreateCard />
                  </PrivateRoute>
                }
              />
              <Route
                path="folders/:folderId/cards/:cardId/edit"
                element={
                  <PrivateRoute>
                    <EditCard />
                  </PrivateRoute>
                }
              />
              <Route
                path="cards/create"
                element={
                  <PrivateRoute>
                    <CreateCard />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={<NotFound />}
              />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
