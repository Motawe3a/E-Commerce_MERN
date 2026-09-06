import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const queryKeys = {
  products: ["products"] as const,
  product: (id: string) => ["products", id] as const,
  cart: ["cart"] as const,
  orders: ["orders"] as const,
  order: (id: string) => ["orders", id] as const,
};
