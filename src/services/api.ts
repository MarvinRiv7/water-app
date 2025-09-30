import axios from "axios";
import { store } from "../store/store";

const api = axios.create({
  baseURL: "https://water-payments-api.onrender.com/api", // tu backend
});

// Interceptor para añadir el token automáticamente
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
