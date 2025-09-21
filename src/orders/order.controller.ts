import { Request, Response } from "express";
import {
  createOrder,
  createOrderSchema,
  getOrderById,
  getOrders,
} from "./order.service";

export const OrdersController = {
  create: async (req: Request, res: Response) => {
    const parse = createOrderSchema.safeParse(req.body);
    if (!parse.success)
      return res.status(400).json({ error: parse.error.flatten() });
    const result = await createOrder(parse.data);
    res.status(201).json(result);
  },

  list: async (req: Request, res: Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await getOrders(page, limit);
    res.json(data);
  },

  get: async (req: Request, res: Response) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Order ID is required" });
    }
    const order = await getOrderById(id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  },
};
