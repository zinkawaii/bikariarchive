import type { Child } from "../remark/types.ts";

export interface JUpdate {
  date: string;
  version: string;
  items: UpdateItem[];
}

export interface UpdateItem {
  type: string;
  scope?: string;
  content: Child[];
}
