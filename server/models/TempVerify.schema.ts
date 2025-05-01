import { defineMongooseModel } from "#nuxt/mongoose";
import type { TempVerifySchema } from "~~/server/types/model";

export const TempVerifyModel = defineMongooseModel<TempVerifySchema>({
    name: "TempVerify",
    schema: {
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
    },
    options: {
        collection: "temp_verify",
    },
});
