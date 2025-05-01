import { defineMongooseModel } from "#nuxt/mongoose";
import type { UserDataSchema } from "~~/server/types/model";

export const UserDataModel = defineMongooseModel<UserDataSchema>({
    name: "UserData",
    schema: {
        uid: {
            type: Number,
            required: true,
            unique: true,
        },
        nickname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
        },
        sex: {
            type: Number,
            required: true,
        },
        sign: {
            type: String,
            required: true,
        },
        identity: {
            type: Number,
            required: true,
        },
        createTime: {
            type: Date,
            required: true,
        },
        hash: {
            type: String,
            required: true,
        },
        salt: {
            type: String,
            required: true,
        },
    },
    options: {
        collection: "user_data",
    },
});
