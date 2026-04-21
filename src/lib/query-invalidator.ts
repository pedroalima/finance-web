import { QueryClient } from "@tanstack/react-query";

const INVALIDATION_MAP = {
  TRANSACTION_UPDATED: [["transactions", "transaction"]],
} as const;

export const invalidateByEvent = (
  queryClient: QueryClient,
  event: keyof typeof INVALIDATION_MAP,
) => {
  const keys = INVALIDATION_MAP[event];
  if (keys) {
    keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
  }
};
