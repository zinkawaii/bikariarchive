import type { Element } from "@bikari/article";
import type { BaseResponse } from "../index";

export interface GetSearchResponse extends BaseResponse {
    list: SearchResult[];
}

export interface SearchResult {
    novel: string;
    index: string;
    count: number;
    parts: Element[];
}
