import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";

export const SearchRecordModel = defineMongooseModel({
    name: "SearchRecord",
    schema: {
        ip: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            required: true
        },
        word: {
            type: String,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "UserData"
        }
    },
    options: {
        collection: "search_record"
    }
});