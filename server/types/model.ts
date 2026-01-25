import type { Types } from "mongoose";
import type { CommentMode } from "#server/types/api/comment";

export interface CommentDataSchema {
    path: string;
    root?: Types.ObjectId;
    parent?: Types.ObjectId;
    content: string;
    time: Date;
    updated: Date;
    ip: string;
    mode: CommentMode;
    nickname?: string;
    email?: string;
    address?: string;
    user?: Types.ObjectId;
}

export interface ReadRecordSchema {
    ip: string;
    time: Date;
    novel: string;
    index: string;
    user?: Types.ObjectId;
}

export interface TempVerifySchema {
    email: string;
    time: Date;
    verify: string;
}

export interface UserDataSchema {
    uid: number;
    nickname: string;
    email: string;
    address?: string;
    sex: number;
    sign: string;
    identity: number;
    createTime: Date;
    hash: string;
    salt: string;
}
