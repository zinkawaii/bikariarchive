import type { Types } from "mongoose";

export interface CommentDataSchema {
  path: string;
  root?: Types.ObjectId;
  parent?: Types.ObjectId;
  content: string;
  time: Date;
  updated: Date;
  ip: string;
  nickname: string;
  email?: string;
  address?: string;
}

export interface ReadRecordSchema {
  ip: string;
  time: Date;
  novel: string;
  index: string;
}
