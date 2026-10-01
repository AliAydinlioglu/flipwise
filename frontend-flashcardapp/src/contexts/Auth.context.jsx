import { createContext, useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import * as api from "../api";

export const JWT_TOKEN_KEY = "jwtToken";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useSWR(token ? "users" : null, api.getById, {
    onError: (error) => {
      if (error?.response?.status === 401) {
        setToken(null);
        localStorage.removeItem(JWT_TOKEN_KEY);
      }
    },
  });
  const { isMutating: loginLoading, error: loginError, trigger: doLogin } = useSWRMutation("auth/login", api.post);
  const { isMutating: registerLoading, error: registerError, trigger: doRegister } = useSWRMutation("auth/register", api.post);

  const setSession = useCallback((token) => {
    setToken(token);
    localStorage.setItem(JWT_TOKEN_KEY, token);
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await doLogin({ email, password });
        const token = (response.headers?.authorization || response.headers?.Authorization)?.replace("Bearer ", "");

        if (token) {
          setSession(token);
          return { success: true };
        }
        return { success: false, error: "Authentication failed." };
      } catch (error) {
        console.error("Login error:", error);
        const status = error?.response?.status;

        const messages = {
          400: "Please check your email and password format.",
          401: error.response?.data?.message || "Invalid email or password.",
          422: "Invalid login data.",
        };

        return {
          success: false,
          error: messages[status] || (status >= 500 ? "Server error. Please try again later." : error?.response?.data?.message || error?.message || "Login failed."),
        };
      }
    },
    [doLogin, setSession]
  );

  const register = useCallback(
    async ({ email, password }) => {
      try {
        const response = await doRegister({ name: email.split("@")[0], email, password });
        const token = (response.headers?.authorization || response.headers?.Authorization)?.replace("Bearer ", "");

        if (token) {
          setSession(token);
          return { success: true };
        }
        return { success: false, error: "Registration completed but authentication failed." };
      } catch (error) {
        console.error("Registration error:", error);
        const status = error?.response?.status;

        if (status === 422) return { success: false, error: "Please check your email format and password requirements." };
        if (status >= 500) return { success: false, error: "Server error. Please try again later." };

        let errorMessage = error?.response?.data?.message || error?.message || "Registration failed.";
        if (
          errorMessage.includes("Duplicate entry") ||
          errorMessage.includes("already exists") ||
          errorMessage.includes("UNIQUE constraint failed") ||
          errorMessage.toLowerCase().includes("duplicate")
        ) {
          errorMessage = "An account with this email address already exists.";
        } else if (!errorMessage || errorMessage.length < 5) {
          errorMessage = "Registration failed. Please try again.";
        }

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [doRegister, setSession]
  );

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem(JWT_TOKEN_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      error: loginError || userError || registerError,
      loading: loginLoading || userLoading || registerLoading,
      isAuthed: Boolean(token),
      ready: !userLoading,
      login,
      logout,
      register,
    }),
    [token, user, loginError, userError, registerError, loginLoading, userLoading, registerLoading, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
