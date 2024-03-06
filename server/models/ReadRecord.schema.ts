import { defineMongooseModel } from "#nuxt/mongoose";
import { Types } from "mongoose";

export const ReadRecordModel = defineMongooseModel<ReadRecord>({
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
            required: true,
            index: true
        },
        user: {
            type: Types.ObjectId,
            ref: "UserData"
        }
    },
    options: {
        collection: "read_record"
    }
});