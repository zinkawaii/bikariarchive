import type { JEntry } from "@bikari/article";

export interface GetEntryResponse extends BaseResponse, JEntry {
    category: string;
}
