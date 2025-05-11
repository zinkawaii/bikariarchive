import { model, Schema, Types } from "mongoose";
import type { CommentDataSchema } from "~~/server/types/model";

export const CommentDataModel = model("CommentData", new Schema<CommentDataSchema>({
    path: {
        type: String,
        required: true,
        index: true,
    },
    parent: {
        type: Types.ObjectId,
        ref: "CommentData",
    },
    children: {
        type: [Types.ObjectId],
        ref: "CommentData",
    },
    content: {
        type: String,
        required: true,
    },
    time: {
        type: Date,
        required: true,
    },
    updated: {
        type: Date,
        required: true,
    },
    ip: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
        enum: ["guest", "user"],
        required: true,
    },
    nickname: {
        type: String,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    user: {
        type: Types.ObjectId,
        ref: "UserData",
    },
}, {
    collection: "comment_data",
}));
