import type { ReadRecordSchema } from "~/server/types/model";

export interface DeleteReadRecordBody {
    id: string;
}

export interface GetReadRecordResponse extends BaseResponse {
    data?: ReadRecordSchema[];
}