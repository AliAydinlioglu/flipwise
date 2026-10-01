import axiosRoot from "axios";
import { JWT_TOKEN_KEY } from "../contexts/Auth.context";

const baseAxios = axiosRoot.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const publicAxios = axiosRoot.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const axios = baseAxios;

baseAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

baseAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(JWT_TOKEN_KEY);
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login") && !currentPath.includes("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const getAll = async (url) => {
  const { data } = await baseAxios.get(url);
  return data.items;
};

export const getById = async (url) => {
  const { data } = await baseAxios.get(url);
  return data;
};

export const getPublic = async (url) => {
  const { data } = await publicAxios.get(url);
  return data;
};

export const save = async (url, { arg: { id, ...data } }) => {
  await baseAxios({
    method: id ? "PUT" : "POST",
    url: `${url}/${id ?? ""}`,
    data,
  });
};

export const deleteById = async (url, { arg: id }) => {
  await baseAxios.delete(`${url}/${id}`);
};

export const post = async (url, { arg }) => {
  return await baseAxios.post(url, arg);
};

export const put = async (url, { arg }) => {
  return await baseAxios.put(url, arg);
};
