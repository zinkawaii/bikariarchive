import { Types } from "mongoose";
import { defineMongooseModel } from "#nuxt/mongoose";

export const SearchRecordModel = defineMongooseModel<SearchRecord>({
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
            type: Types.ObjectId,
            ref: "UserData"
        }
    },
    options: {
        collection: "search_record"
    }
});