import type { JUpdate } from "@bikari/article";
import type { BaseResponse } from "../index";

export interface GetUpdateResponse extends BaseResponse {
    list: JUpdate[];
}
