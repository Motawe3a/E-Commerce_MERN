import { useQuery } from "@tanstack/react-query";
import { getProduct, getProducts } from "@/api/products";
import { queryKeys } from "@/lib/queryClient";

export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: getProducts,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.product(id ?? ""),
    queryFn: () => getProduct(id as string),
    enabled: Boolean(id),
  });
}
