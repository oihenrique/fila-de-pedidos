import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 3333),

  MONGO_URI:
    process.env.MONGO_URI ?? "mongodb://localhost:27017/fila_de_pedidos",

  KAFKA_BROKERS: (process.env.KAFKA_BROKERS ?? "localhost:9092").split(","),
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID ?? "orders-app",
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID ?? "orders-workers",

  ORDERS_CREATED_TOPIC: process.env.ORDERS_CREATED_TOPIC ?? "orders.created",
};
