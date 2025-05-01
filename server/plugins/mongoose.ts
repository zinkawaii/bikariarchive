import consola from "consola";
import mongoose from "mongoose";

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
