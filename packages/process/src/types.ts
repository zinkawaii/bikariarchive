export interface JArticle<T> {
    [novel: string]: JNovel<T>;
}

export interface JNovel<T> {
    author: string;
    title: string;
    type: "novel" | "blog";
    tag: string[];
    synopsis: string;
    cover: string;
    volumes: JVolume[];
    chapters: T[];
}

export interface JVolume {
    title: string;
    cover: string;
    ending: boolean;
}

export interface JChapter extends Omit<ArticleFrontMatter, "abbrlink" | "password"> {
    index: string;
    volume: number;
    encrypted?: boolean;
    wordCount: number;
}

export interface ArticleFrontMatter {
    title: string;
    abbrlink?: string;
    date?: string;
    refactored?: string;
    updated?: string;
    draft?: boolean;
    ending?: boolean;
    password?: string;
    runtime?: boolean;
}