export interface Root {
    type: "root";
    children: Element[];
}

export interface Element {
    type: "element";
    tag: string;
    props: Record<string, any>;
    children: (Element | Text)[];
}

export interface Text {
    type: "text";
    value: string;
}

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
    excerpt?: string;
    abbrlink?: string;
    date?: string;
    refactored?: string;
    updated?: string;
    cover?: string;
    draft?: boolean;
    ending?: boolean;
    password?: string;
    sticky?: number;
}

export interface JArtmap {
    [novel: string]: {
        [index: string]: {
            name: string;
            password: string;
        };
    };
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

export enum EntryTalentType {
    NOURYOKU = "超能力",
    TAISHITSU = "体质",
    GANBOU = "愿望"
}

export type EntryTalent = {
    content: Root;
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
    content: Root;
}

export interface EntryDetail {
    title: string;
    component?: string;
    props?: Record<string, any>;
    content?: Root;
}