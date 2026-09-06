import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCartItem,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/api/cart";
import { useAuth } from "@/auth/useAuth";
import { normalizeError } from "@/lib/apiError";
import { queryKeys } from "@/lib/queryClient";
import type { Cart } from "@/types/api";

/** Active cart for the signed-in user. Disabled (and empty) for guests. */
export function useCart() {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.cart,
    queryFn: getCart,
    enabled: isAuthenticated,
  });

  const itemCount =
    query.data?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return { ...query, itemCount };
}

export function useCartMutations() {
  const queryClient = useQueryClient();

  const onSuccess = (cart: Cart) => {
    queryClient.setQueryData(queryKeys.cart, cart);
  };
  const onError = (error: unknown) => {
    toast.error(normalizeError(error));
  };

  const addItem = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addCartItem(productId, quantity),
    onSuccess: (cart) => {
      onSuccess(cart);
      toast.success("Added to cart");
    },
    onError,
  });

  const updateItem = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem(productId, quantity),
    onSuccess,
    onError,
  });

  const removeItem = useMutation({
    mutationFn: (productId: string) => removeCartItem(productId),
    onSuccess: (cart) => {
      onSuccess(cart);
      toast.success("Removed from cart");
    },
    onError,
  });

  const clear = useMutation({
    mutationFn: clearCart,
    onSuccess,
    onError,
  });

  return { addItem, updateItem, removeItem, clear };
}
