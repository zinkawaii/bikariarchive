import { Types } from "mongoose";
import { defineMongooseModel } from "#nuxt/mongoose";
import type { SearchRecordSchema } from "~/server/types/model";

export const SearchRecordModel = defineMongooseModel<SearchRecordSchema>({
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