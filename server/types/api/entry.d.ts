import type { jEntry } from "@bikari/process";

export interface GetEntryResponse extends BaseResponse, jEntry {
    category?: string;
}