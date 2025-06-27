import type { JEntry } from "@bikari/article";
import type { BaseResponse } from "../index";

export interface GetEntryResponse extends BaseResponse, JEntry {
    category: string;
}
