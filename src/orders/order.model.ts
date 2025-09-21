import { Schema, model } from "mongoose";
import { OrderDoc, OrderItem } from "./order.types";

const Item = new Schema<OrderItem>({
  sku: { type: String, required: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
});

const Order = new Schema<OrderDoc>(
  {
    orderId: { type: String, unique: true, index: true, required: true },
    customerId: { type: String, required: true, index: true },
    items: { type: [Item], required: true },
    total: { type: Number, default: 0 },
    currency: { type: String, default: "BRL" },
    status: {
      type: String,
      enum: ["RECEIVED", "PROCESSED", "FAILED"],
      default: "RECEIVED",
      index: true,
    },
  },
  { timestamps: true }
);

export const OrderModel = model<OrderDoc>("orders", Order);
