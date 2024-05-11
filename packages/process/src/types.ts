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

export interface jEntry {
    title: string;
    summary?: string;
    info?: Record<string, string>[];
    illustration?: EntryIllustration[];
    talent?: EntryTalent[];
    relationship?: EntryRelationship[];
    details?: EntryDetail[];
}

export interface EntryIllustration {
    title: string;
    src: string;
    illustrator: string;
}

export enum EntryTalentType {
    NOURYOKU = "超能力",
    TAISHITSU = "体质",
    GANBOU = "愿望"
}

export type EntryTalent = {
    content: string;
} & ({
    type: EntryTalentType.NOURYOKU;
    name: {
        zh: string;
        jp: string;
        en: string;
    };
    star: number;
    class: string[];
} | {
    type: Exclude<EntryTalentType, EntryTalentType.NOURYOKU>;
    name: string;
});

export interface EntryRelationship {
    name: string;
    relation: string;
    content: string;
}

export interface EntryDetail {
    title: string;
    component?: string;
    attrs?: Record<string, any>;
    content?: string;
}