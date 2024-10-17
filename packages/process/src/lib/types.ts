import type { Root } from "../remark/types";

export type NovelType = "novel" | "blog";

export interface JArticle<T> {
    [novel: string]: JNovel<T>;
}

export interface JNovel<T> {
    author: string;
    title: string;
    type: NovelType;
    tag: string[];
    synopsis: string;
    cover?: string;
    volumes: JVolume[];
    chapters: T[];
}

export interface JVolume {
    title: string;
    cover?: string;
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
    excerpt?: string;
    abbrlink?: string;
    date?: string;
    refactored?: string;
    updated?: string;
    cover?: ArticleCover;
    draft?: boolean;
    ending?: boolean;
    password?: string;
    sticky?: number;
}

export interface ArticleCover {
    src: string;
    reference?: string;
    align?: "top" | "center" | "bottom";
}

export interface JArtmap {
    [novel: string]: {
        [index: string]: {
            name: string;
            password: string;
        };
    };
}

export interface JIntel {
    blocks: IntelBlock[];
    all: string[];
}

export interface IntelBlock {
    title: string;
    icon: string;
    children: IntelBranch[];
}

export interface IntelBranch {
    title: string;
    children: IntelLeaf[];
}

export interface IntelLeaf {
    title: string;
    children: IntelItem[];
}

export interface IntelItem {
    title: string;
    children: (string | [string, string])[];
}

export interface JIntmap {
    [entry: string]: string;
}

export interface JEntry {
    title: string;
    summary?: Root;
    brief?: EntryBrief;
    appearance?: EntryAppearance;
    illustration?: EntryIllustration[];
    talent?: EntryTalent[];
    relationship?: EntryRelationship[];
    details?: EntryDetail[];
}

export interface EntryBrief {
    name?: Record<"zh" | "jp" | "ka" | "en", string>;
    sex?: string;
    age?: number;
}

export interface EntryAppearance {
    novel: string;
    index: string;
}

export interface EntryIllustration {
    title: string;
    src: string;
    illustrator: string;
}

export type EntryTalentType = "超能力" | "体质" | "愿望";

export type EntryTalent = {
    content?: Root;
} & ({
    type: "超能力";
    name: {
        zh: string;
        jp: string;
        en: string;
    };
    star: number;
    class: string[];
} | {
    type: Exclude<EntryTalentType, "超能力">;
    name: string;
});

export interface EntryRelationship {
    name: string;
    relation: string;
    content?: Root;
}

export interface EntryDetail {
    title: string;
    component?: string;
    props?: Record<string, any>;
    content?: Root;
}