import { Types } from "mongoose";
import { defineMongooseModel } from "#nuxt/mongoose";
import type { CommentDataSchema } from "~~/server/types/model";

export const CommentDataModel = defineMongooseModel<CommentDataSchema>({
    name: "CommentData",
    schema: {
        path: {
            type: String,
            required: true,
            index: true
        },
        parent: {
            type: Types.ObjectId,
            ref: "CommentData"
        },
        children: {
            type: [Types.ObjectId],
            ref: "CommentData"
        },
        content: {
            type: String,
            required: true
        },
        time: {
            type: Date,
            required: true
        },
        updated: {
            type: Date,
            required: true
        },
        ip: {
            type: String,
            required: true
        },
        mode: {
            type: String,
            enum: ["guest", "user"],
            required: true
        },
        nickname: {
            type: String
        },
        email: {
            type: String
        },
        address: {
            type: String
        },
        user: {
            type: Types.ObjectId,
            ref: "UserData"
        }
    },
    options: {
        collection: "comment_data"
    }
});