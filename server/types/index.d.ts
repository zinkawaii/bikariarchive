import type { ObjectId } from "mongoose";

declare global {
    interface BaseResponse {
        error: number;
    }

    interface CommentData {
        path: string;
        parent: ObjectId;
        children: ObjectId[];
        content: string;
        time: Date;
        nickname: string;
        email: string;
        address: string;
        ip: string;
        user: ObjectId;
    }

    interface ReadRecord {
        ip: string;
        time: Date;
        novel: string;
        index: string;
        user: ObjectId;
    }

    interface SearchRecord {
        ip: string;
        time: Date;
        word: string;
        user: ObjectId;
    }

    interface TempVerify {
        email: string;
        time: Date;
        verify: string;
    }

    interface UserData {
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
}

declare module "@kikiutils/nuxt-session" {
    interface H3EventContextSession {
        uid: number;
        identity: number;
    }
}

export {};