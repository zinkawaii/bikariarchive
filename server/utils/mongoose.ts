import consola from "consola";
import mongoose from "mongoose";
import "#server/models/CommentData";
import "#server/models/ReadRecord";
import "#server/models/TempVerify";
import "#server/models/UserData";

export async function connectMongoose() {
    const config = useRuntimeConfig();
    const nitroApp = useNitroApp();

    nitroApp.hooks.hook("close", () => {
        mongoose.disconnect();
    });

    try {
        await mongoose.connect(config.mongoose.uri, config.mongoose.options);
    }
    catch (err) {
        consola.error(`Failed to connect to MongoDB: ${err}`);
    }
}
