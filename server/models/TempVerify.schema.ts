import { defineMongooseModel } from "#nuxt/mongoose";

export const TempVerifyModel = defineMongooseModel({
    name: "TempVerify",
    schema: {
        email: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            required: true
        },
        verify: {
            type: String,
            required: true
        }
    },
    options: {
        collection: "temp_verify"
    }
});