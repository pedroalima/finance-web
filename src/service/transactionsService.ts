import { Transaction } from "../types/transactions";
import { api } from "./api";

export const getAllTransactions = async (month?: number, year?: number) => {
  let url = "/transactions";

  if (month && year) {
    url += `?month=${month}&year=${year}`;
  }

  const response = await api.get(url);
  return response.data.data;
};

export const getTransactionById = async (id: string) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data.data;
};

export const createTransaction = async (body: Transaction) => {
  const response = await api.post("/transactions", body);
  return response;
};

export const updateTransaction = async (id: string, body: Transaction) => {
  const response = await api.put(`/transactions/${id}`, body);
  return response;
};

export const deleteTransaction = async (id: number) => {
  const response = await api.delete(`/transactions/${id}`);
  return response;
};
