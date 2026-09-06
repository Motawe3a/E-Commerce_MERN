/**
 * Client-side mirrors of the backend Mongoose documents
 * (see backend/src/models/). Timestamps are serialised to ISO strings over HTTP.
 */

export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface Product {
  _id: string;
  title: string;
  image: string;
  price: number;
  stock: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/** Cart line as returned by the API — the product is NOT populated. */
export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export type CartStatus = "active" | "completed";

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;
}

/** Order line — snapshots title/image/unitPrice at checkout time. */
export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  quantity: number;
  unitPrice: number;
}

export type OrderStatus = "placed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  address: string;
  status: OrderStatus;
  paymentStatus: "paid";
  createdAt: string;
  updatedAt: string;
}
