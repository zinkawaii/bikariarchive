import type { ObjectId } from "mongoose";
import type { CommentMode } from "~~/server/types/api/comment";

export interface CommentDataSchema {
    path: string;
    parent?: ObjectId;
    children: ObjectId[];
    content: string;
    time: Date;
    updated: Date;
    ip: string;
    mode: CommentMode;
    nickname?: string;
    email?: string;
    address?: string;
    user?: ObjectId;
}

export interface ReadRecordSchema {
    ip: string;
    time: Date;
    novel: string;
    index: string;
    user?: ObjectId;
}

export interface SearchRecordSchema {
    ip: string;
    time: Date;
    word: string;
    user?: ObjectId;
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
    sex: number;
    sign: string;
    identity: number;
    createTime: Date;
    hash: string;
    salt: string;
}