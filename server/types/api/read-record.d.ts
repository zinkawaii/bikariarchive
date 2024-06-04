import type { ReadRecordSchema, UserDataSchema } from "~/server/types/model";

export interface DeleteReadRecordBody {
    id: string;
}

export interface GetReadRecordResponse extends BaseResponse {
    data?: (Omit<ReadRecordSchema, "user"> & {
        _id: string;
        user?: UserDataSchema;
    })[];
}