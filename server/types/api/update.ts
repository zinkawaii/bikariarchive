import type { JUpdate } from "@bikari/article";

export interface GetUpdateResponse extends BaseResponse {
    list: JUpdate[];
}
