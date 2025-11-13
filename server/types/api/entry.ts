import type { JEntry } from "@bikari/article";

export interface GetEntryResponse extends JEntry {
    category: string;
}
