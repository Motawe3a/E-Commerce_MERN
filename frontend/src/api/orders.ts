import { api } from "@/lib/axios";
import type { Order } from "@/types/api";

export async function checkout(address: string): Promise<Order> {
  const { data } = await api.post<Order>("/orders/checkout", { address });
  return data;
}

export async function getOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>("/orders");
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await api.get<Order>(`/orders/${id}`);
  return data;
}
