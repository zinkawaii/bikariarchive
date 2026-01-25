import { model, Schema } from "mongoose";
import type { TempVerifySchema } from "#server/types/model";

export const TempVerifyModel = model("TempVerify", new Schema<TempVerifySchema>({
    email: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    verify: {
        type: String,
        required: true,
    },
}, {
    collection: "temp_verify",
}));
