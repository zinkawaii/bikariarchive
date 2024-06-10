export interface GetSearchResponse extends BaseResponse {
    list?: SearchResult[];
}

export interface SearchResult {
    novel: string;
    index: string;
    count: number;
    parts: string[];
}