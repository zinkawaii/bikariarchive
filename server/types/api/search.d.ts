export interface GetSearchResponse extends BaseResponse {
    results?: SearchResult[];
}

export interface SearchResult {
    index: string;
    count: number;
    parts: string[];
}