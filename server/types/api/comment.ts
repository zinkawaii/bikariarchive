export type CommentMode = "guest" | "user";

export interface DeleteCommentBody {
    id: string;
}

export interface GetCommentResponse extends BaseResponse {
    totalCount: number;
    mainCount: number;
    list: CommentData[];
}

export interface CommentData {
    id: string;
    children: CommentData[];
    content: string;
    time: string;
    mode: CommentMode;
    nickname: string;
    avatar: string;
    email?: string;
    address?: string;
    character: string;
}

export interface PostCommentBody {
    path: string;
    parent?: string;
    content: string;
    mode: CommentMode;
    nickname: string;
    email?: string;
    address?: string;
}

export interface PutCommentBody {
    id: string;
    content: string;
    nickname?: string;
    email?: string;
    address?: string;
}