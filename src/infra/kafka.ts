import { Kafka, logLevel } from "kafkajs";
import { env } from "../config/env";
import { logger } from "../shared/logger";

export const kafka = new Kafka({
  clientId: env.KAFKA_CLIENT_ID,
  brokers: env.KAFKA_BROKERS,
  logLevel: logLevel.ERROR,
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: env.KAFKA_GROUP_ID });

export async function startKafka() {
  await producer.connect();
  logger.info("Kafka producer connected");
}
