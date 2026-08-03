import { model, Schema } from "mongoose";
import type { ReadRecordSchema } from "#server/types/model";

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
}, {
  collection: "read_record",
}));
