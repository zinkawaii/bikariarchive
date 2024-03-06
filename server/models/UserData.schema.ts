import { defineMongooseModel } from "#nuxt/mongoose";

export const UserDataModel = defineMongooseModel<UserData>({
    name: "UserData",
    schema: {
        uid: {
            type: Number,
            required: true,
            unique: true
        },
        nickname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        sex: {
            type: Number
        },
        sign: {
            type: String
        },
        identity: {
            type: Number
        },
        createTime: {
            type: Date,
            required: true
        },
        hash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    },
    options: {
        collection: "user_data"
    }
});