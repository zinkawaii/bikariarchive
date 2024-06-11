export type CommentMode = "post" | "reply" | "modify";

export interface CommentReplyOptions {
    id: string;
    nickname: string;
}

export interface CommentModifyOptions {
    id: string;
    content: string;
    nickname: string;
    address: string;
}