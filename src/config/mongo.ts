import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../shared/logger";

export async function connectMongo() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGO_URI);
  logger.info("Mongo connected");
}
