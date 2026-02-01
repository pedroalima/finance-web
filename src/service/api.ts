import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Criação do client Axios
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@finance:token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
