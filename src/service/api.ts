import axios from "axios";

// Criação do client Axios
export const api = axios.create({
  baseURL: "http://192.168.1.70:8080/api",
  timeout: 20000,
});
