import { randomUUID } from "node:crypto";
import { z } from "zod";
import { OrderModel } from "./order.model";
import { producer } from "../infra/kafka";
import { env } from "../config/env";
import { CreateOrderInput } from "./order.types";

export const createOrderSchema = z.object({
  customerId: z.string().min(1),
  items: z
    .array(
      z.object({
        sku: z.string().min(1),
        qty: z.number().int().positive(),
        price: z.number().nonnegative(),
      })
    )
    .min(1),
  currency: z.string().default("BRL"),
});

export async function createOrder(order: CreateOrderInput) {
  const orderId = randomUUID();
  await OrderModel.create({
    orderId,
    customerId: order.customerId,
    items: order.items,
    currency: order.currency,
    status: "RECEIVED",
  });

  await producer.send({
    topic: env.ORDERS_CREATED_TOPIC,
    messages: [
      {
        key: orderId,
        value: JSON.stringify({
          orderId,
          payload: order,
          metadata: {
            traceId: orderId,
            createdAt: new Date().toISOString(),
            schemaVersion: 1,
          },
        }),
      },
    ],
  });

  return { orderId };
}

export async function getOrders(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    OrderModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    OrderModel.countDocuments(),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

export async function getOrderById(id: string) {
  return OrderModel.findOne({ orderId: id });
}
