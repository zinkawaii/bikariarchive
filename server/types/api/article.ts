import type { Root } from "@bikari/article";

export interface GetArticleResponse {
    body: Root;
    token: string;
}

export interface PatchArticleBody {
    token: string;
}

export interface PatchArticleResponse {
    count: number;
}
