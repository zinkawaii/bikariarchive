import type { CommentData } from "~~/server/types/api/comment";

export type CommentKind = "post" | "reply" | "modify";

export type CommentReplyOptions = Pick<CommentData, "id" | "nickname">;
export type CommentModifyOptions = Pick<CommentData, "id" | "content" | "mode" | "nickname" | "email" | "address">;