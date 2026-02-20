import type { CodeInformation } from "@volar/language-core";
import type { Document } from "yaml";

export type Code = string | [
    source: string,
    offset: number,
    features: CodeInformation,
];

export interface Config {
    mappings: Mapping[];
}

export interface Mapping {
    frontmatter: Import;
    patterns: string[];
}

export type Import = [specifier: string, type: string] | [];

export interface Frontmatter {
    root: Document;
    offset: number;
}

export interface Expression {
    type: "slot" | "interpolation";
    source: string;
    offset: number;
}
