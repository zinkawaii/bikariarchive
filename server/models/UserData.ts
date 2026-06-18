import { model, Schema } from "mongoose";
import type { UserDataSchema } from "#server/types/model";

export const UserDataModel = model("UserData", new Schema<UserDataSchema>({
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
    default: "",
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
}, {
  collection: "user_data",
}));
