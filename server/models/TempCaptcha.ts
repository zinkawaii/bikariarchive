import { model, Schema } from "mongoose";
import type { TempCaptchaSchema } from "#server/types/model";

export const TempCaptchaModel = model("TempCaptcha", new Schema<TempCaptchaSchema>({
    email: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    captcha: {
        type: String,
        required: true,
    },
}, {
    collection: "temp_captcha",
}));
