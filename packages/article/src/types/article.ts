import type { Child } from "../markdown/types.ts";

export type NovelType = "novel" | "blog";

export interface JArticle<T = JChapter> {
  [novel: string]: JNovel<T>;
}

export type NovelFrontmatter = Omit<JNovel, "chapters">;

export interface JNovel<T = JChapter> {
  title: string;
  author: string;
  type: NovelType;
  tag: string[];
  synopsis: Child[];
  cover?: string;
  volumes: JVolume[];
  chapters: T[];
}

export interface JVolume {
  title: string;
  cover?: string;
  variant?: ArticleVariant;
  ending?: boolean;
}

export interface JChapter extends Omit<ArticleFrontmatter, "abbrlink" | "password"> {
  index: string;
  volume: number;
  encrypted?: boolean;
  wordCount: number;
}

export interface ArticleFrontmatter {
  title: string;
  excerpt?: Child[];
  abbrlink?: string;
  date?: {
    created?: string;
    published?: string;
    refactored?: string;
    updated?: string;
  };
  cover?: ArticleCover;
  variant?: ArticleVariant;
  draft?: boolean;
  ending?: boolean;
  password?: string;
  sticky?: number;
}

export interface ArticleCover {
  src: string;
  reference?: string;
  align?: string;
}

export type ArticleVariant = "general" | "article" | "story" | "comment";

export interface JArtmap {
  [novel: string]: {
    [index: string]: {
      name: string;
      password: string;
    };
  };
}
