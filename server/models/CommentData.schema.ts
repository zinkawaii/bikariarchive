import { defineMongooseModel } from "#nuxt/mongoose";
import { Schema } from "mongoose";

export const CommentDataModel = defineMongooseModel({
    name: "CommentData",
    schema: {
        path: {
            type: String,
            required: true,
            index: true
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "CommentData"
        },
        children: {
            type: [Schema.Types.ObjectId],
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
            type: Schema.Types.ObjectId,
            ref: "UserData"
        }
    },
    options: {
        collection: "comment_data"
    }
});