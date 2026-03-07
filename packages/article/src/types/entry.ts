import type { Child } from "../remark/types";

export interface JEntry {
    title: string;
    draft?: boolean;
    summary?: Child[];
    brief?: EntryBrief;
    appearance?: EntryAppearance;
    illustrations?: EntryIllustration[];
    talents?: EntryTalent[];
    relationships?: EntryRelationship[];
    details?: EntryDetail[];
}

export interface EntryName {
    zh: string;
    ja?: string;
    ruby?: string;
    en?: string;
}

export interface EntryBrief {
    name?: EntryName;
    sex?: string;
    age?: number | null;
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

export interface EntryTalentNouryoku {
    type: "超能力";
    name: EntryName;
    star: number;
    class: string[];
    content?: Child[];
}

export interface EntryTalentGeneral {
    type: "体质" | "愿望";
    name: string;
    content?: Child[];
}

export type EntryTalent = EntryTalentNouryoku | EntryTalentGeneral;

export interface EntryRelationship {
    name: string;
    relation: string;
    content?: Child[];
}

export interface EntryDetail {
    title: string;
    content: Child[];
}
