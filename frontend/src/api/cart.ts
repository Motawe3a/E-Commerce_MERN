import { api } from "@/lib/axios";
import type { Cart } from "@/types/api";

export async function getCart(): Promise<Cart> {
  const { data } = await api.get<Cart>("/cart");
  return data;
}

export async function addCartItem(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const { data } = await api.post<Cart>("/cart/items", { productId, quantity });
  return data;
}

export async function updateCartItem(
  productId: string,
  quantity: number,
): Promise<Cart> {
  const { data } = await api.put<Cart>(`/cart/items/${productId}`, { quantity });
  return data;
}

export async function removeCartItem(productId: string): Promise<Cart> {
  const { data } = await api.delete<Cart>(`/cart/items/${productId}`);
  return data;
}

export async function clearCart(): Promise<Cart> {
  const { data } = await api.delete<Cart>("/cart");
  return data;
}
