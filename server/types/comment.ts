export interface CommentData {
  id: string;
  children: CommentData[];
  content: string;
  time: string;
  nickname: string;
  avatar?: string;
  address?: string;
  pending?: boolean;
}
