import mongoose from "mongoose";
import { useRuntimeConfig } from "nuxt/server";
import "#server/models/CommentData";
import "#server/models/ReadRecord";

export async function connectMongoose() {
  const config = useRuntimeConfig();
  await mongoose.connect(config.mongoose.uri, config.mongoose.options);
}
