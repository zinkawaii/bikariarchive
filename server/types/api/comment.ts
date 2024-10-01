export interface DeleteCommentBody {
    id: string;
}

export interface GetCommentResponse extends BaseResponse {
    totalCount?: number;
    mainCount?: number;
    list?: CommentData[];
}

export interface CommentData {
    id: string;
    children: CommentData[];
    content: string;
    time: string;
    nickname: string;
    avatar: string;
    address: string;
}

export interface PostCommentBody {
    path: string;
    parent: string;
    content: string;
    nickname: string;
    email: string;
    address: string;
}

export interface PutCommentBody {
    id: string;
    content: string;
    nickname: string;
    address: string;
}