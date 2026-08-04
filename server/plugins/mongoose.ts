import mongoose from "mongoose";
import { definePlugin } from "nitro";

export default definePlugin((nitroApp) => {
  nitroApp.hooks.hook("close", async () => {
    await mongoose.disconnect();
  });
});
