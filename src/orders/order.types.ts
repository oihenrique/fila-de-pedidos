import { Document } from "mongoose";
import { createOrderSchema } from "./order.service";
import z from "zod";

export type OrderStatus = "RECEIVED" | "PROCESSED" | "FAILED";

export interface OrderItem {
  sku: string;
  qty: number;
  price: number;
}

export interface OrderDoc extends Document {
  orderId: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  currency: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
