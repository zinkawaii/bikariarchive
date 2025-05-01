import { model, Schema, Types } from "mongoose";
import type { SearchRecordSchema } from "~~/server/types/model";

export const SearchRecordModel = model("SearchRecord", new Schema<SearchRecordSchema>({
    ip: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    word: {
        type: String,
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: "UserData",
    },
}, {
    collection: "search_record",
}));
