import consola from "consola";
import mongoose from "mongoose";
import { useNitroApp } from "nitro/app";
import { useRuntimeConfig } from "nitro/runtime-config";
import "#server/models/CommentData";
import "#server/models/ReadRecord";

export async function connectMongoose() {
  const config = useRuntimeConfig();
  const nitroApp = useNitroApp();

  nitroApp.hooks?.hook("close", async () => {
    await mongoose.disconnect();
  });

  try {
    await mongoose.connect(config.mongoose.uri, config.mongoose.options);
  }
  catch (err) {
    consola.error(`Failed to connect to MongoDB:`, err);
  }
}
