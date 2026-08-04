import consola from "consola";
import mongoose from "mongoose";
import { useRuntimeConfig } from "nitro/runtime-config";
import "#server/models/CommentData";
import "#server/models/ReadRecord";

export async function connectMongoose() {
  const config = useRuntimeConfig();

  try {
    await mongoose.connect(config.mongoose.uri, config.mongoose.options);
  }
  catch (err) {
    consola.error(`Failed to connect to MongoDB:`, err);
  }
}
