import consola from "consola";
import mongoose from "mongoose";
import "#server/models/CommentData";
import "#server/models/ReadRecord";
import "#server/models/TempCaptcha";
import "#server/models/UserData";

export async function connectMongoose() {
    const config = useRuntimeConfig();
    const nitroApp = useNitroApp();

    nitroApp.hooks.hook("close", async () => {
        await mongoose.disconnect();
    });

    try {
        await mongoose.connect(config.mongoose.uri, config.mongoose.options);
    }
    catch (err) {
        consola.error(`Failed to connect to MongoDB:`, err);
    }
}
