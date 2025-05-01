import { model, Schema, Types } from "mongoose";
import type { ReadRecordSchema } from "~~/server/types/model";

export const ReadRecordModel = model("ReadRecord", new Schema<ReadRecordSchema>({
    ip: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    novel: {
        type: String,
        required: true,
    },
    index: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: Types.ObjectId,
        ref: "UserData",
    },
}, {
    collection: "read_record",
}));
