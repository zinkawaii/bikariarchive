import type { Element } from "@bikari/article";

export interface GetSearchResponse extends BaseResponse {
    list: SearchResult[];
}

export interface SearchResult {
    novel: string;
    index: string;
    count: number;
    parts: Element[];
}
