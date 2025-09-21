import { Router } from "express";
import { OrdersController } from "../orders/order.controller";

export const routes = Router();

routes.post("/orders", OrdersController.create);
routes.get("/orders", OrdersController.list);
routes.get("/orders/:id", OrdersController.get);
