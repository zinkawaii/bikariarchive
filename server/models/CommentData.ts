import { model, Schema, Types } from "mongoose";
import type { CommentDataSchema } from "#server/types/model";

export const CommentDataModel = model("CommentData", new Schema<CommentDataSchema>({
  path: {
    type: String,
    required: true,
    index: true,
  },
  root: {
    type: Types.ObjectId,
    ref: "CommentData",
  },
  parent: {
    type: Types.ObjectId,
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
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "public"],
    required: true,
  },
}, {
  collection: "comment_data",
}));
