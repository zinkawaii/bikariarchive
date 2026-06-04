export type CommentMode = "guest" | "user";

export interface CommentData {
    id: string;
    children: CommentData[];
    content: string;
    time: string;
    mode: CommentMode;
    nickname: string;
    avatar?: string;
    email?: string;
    address?: string;
    character: string;
}
