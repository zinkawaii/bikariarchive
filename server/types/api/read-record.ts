import type { ReadRecordSchema, UserDataSchema } from "~~/server/types/model";
import type { BaseResponse } from "../index";

export interface DeleteReadRecordBody {
    id: string;
}

export interface GetReadRecordResponse extends BaseResponse {
    total: number;
    sizes: number;
    list: (Omit<ReadRecordSchema, "user"> & {
        _id: string;
        user?: Pick<UserDataSchema, "uid">;
    })[];
}
