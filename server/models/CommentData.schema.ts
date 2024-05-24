import { Types } from "mongoose";
import { defineMongooseModel } from "#nuxt/mongoose";
import type { CommentDataSchema } from "~/server/types/model";

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
        nickname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            type: String
        },
        ip: {
            type: String,
            required: true
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