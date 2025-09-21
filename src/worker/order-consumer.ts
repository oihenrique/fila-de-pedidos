import { consumer } from "../infra/kafka";
import { env } from "../config/env";
import { OrderModel } from "../orders/order.model";
import { logger } from "../shared/logger";
import { connectMongo } from "../config/mongo";
import { KafkaMessage } from "kafkajs";
import "dotenv/config";

function calcTotal(items: { qty: number; price: number }[]) {
  return items.reduce((acc, it) => acc + it.qty * it.price, 0);
}

async function handleMessage(message: KafkaMessage) {
  if (!message.value) return;
  const evt = JSON.parse(message.value.toString()) as {
    orderId: string;
    payload: {
      customerId: string;
      items: { qty: number; price: number }[];
      currency: string;
    };
  };

  const order = await OrderModel.findOne({ orderId: evt.orderId });
  if (!order) {
    logger.warn({ orderId: evt.orderId }, "Order not found, skipping");
    return;
  }
  if (order.status === "PROCESSED") {
    logger.info({ orderId: evt.orderId }, "Already processed, skipping");
    return;
  }

  try {
    const total = calcTotal(evt.payload.items);
    order.total = total;
    order.status = "PROCESSED";
    await order.save();
    logger.info({ orderId: order.orderId, total }, "Order processed");
  } catch (err: any) {
    await OrderModel.updateOne(
      { orderId: evt.orderId },
      { $set: { status: "FAILED" } }
    );
    logger.error({ err, orderId: evt.orderId }, "Processing failed");
  }
}

async function main() {
  await connectMongo();
  await consumer.connect();
  await consumer.subscribe({
    topic: env.ORDERS_CREATED_TOPIC,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ message }) => handleMessage(message),
  });
  logger.info("Worker listening...");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
