import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";

export const ReadRecordModel = defineMongooseModel({
    name: "ReadRecord",
    schema: {
        ip: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            required: true
        },
        novel: {
            type: String,
            required: true
        },
        index: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "UserData"
        }
    },
    options: {
        collection: "read_record"
    }
});