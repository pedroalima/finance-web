// src/hooks/useTransactions.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../service/axios/config";
import { Transaction } from "../types/transactions";

export function useTransactions() {
  return useQuery<Transaction[], Error>({
    queryKey: ["transactions"],
    queryFn: async () => {
      // Exemplo: pegar dados de uma API
      const response = await api.get("/transactions");
      return response.data.data;
    },
  });
}
