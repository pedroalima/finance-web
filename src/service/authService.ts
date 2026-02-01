import { RegisterData } from "../types/auth";
import { api } from "./api";

// Adicione ao seu arquivo de serviços
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/login", credentials);
  return response.data; // Ajuste conforme a estrutura do seu back (ex: response.data.token)
};

export const registerUser = async (data: RegisterData) => {
  const response = await api.post("/users", data);
  return response.data;
};
