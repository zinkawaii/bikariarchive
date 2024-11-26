import type { Child } from "../remark/types";

export type NovelType = "novel" | "blog";

export interface JArticle<T> {
    [novel: string]: JNovel<T>;
}

export type NovelFrontmatter = Omit<JNovel<JChapter>, "chapters">;

export interface JNovel<T> {
    author: string;
    title: string;
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
    align?: string;
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
    summary?: Child[];
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
    content?: Child[];
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
    content?: Child[];
}

export interface EntryDetail {
    title: string;
    content: Child[];
}

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