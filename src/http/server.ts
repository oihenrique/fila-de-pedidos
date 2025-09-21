// Objetivo: API cria pedidos → publica no Kafka → consumidor processa e persiste
// no MongoDB → API lista pedidos.
import express from "express";
import cors from "cors";
import { routes } from "./routes";
import { connectMongo } from "../config/mongo";
import { startKafka } from "../infra/kafka";
import { env } from "../config/env";
import { logger } from "../shared/logger";

async function bootstrap() {
  await connectMongo();
  await startKafka();

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(routes);

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.listen(env.PORT, () =>
    logger.info(`HTTP server running on :${env.PORT}`)
  );
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
