import consola from "consola";
import mongoose from "mongoose";
import "~~/server/models/CommentData";
import "~~/server/models/ReadRecord";
import "~~/server/models/SearchRecord";
import "~~/server/models/TempVerify";
import "~~/server/models/UserData";

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();

    nitroApp.hooks.hook("close", () => {
        mongoose.disconnect();
    });

    try {
        await mongoose.connect(config.mongoose.uri, config.mongoose.options);
        consola.success("Connected to MongoDB");
    }
    catch (err) {
        consola.error(`Failed to connect to MongoDB: ${err}`);
    }
});
