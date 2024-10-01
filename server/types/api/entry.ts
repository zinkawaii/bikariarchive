import type { JEntry } from "@bikari/process";

export interface GetEntryResponse extends BaseResponse, JEntry {
    category?: string;
}