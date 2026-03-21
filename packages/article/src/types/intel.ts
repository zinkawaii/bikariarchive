export interface JIntel {
    blocks: IntelBlock[];
    entries: Record<string, boolean>;
    redirects: Record<string, string>;
}

export interface IntelNode<T = unknown> {
    title?: string;
    unknown?: boolean;
    children: T[];
}

export interface IntelBlock extends IntelFrontmatter {
    abbr: string;
}

export type IntelFrontmatter = IntelNode<IntelBranch>;

export type IntelBranch = IntelNode<IntelLeaf | IntelItem>;

export type IntelLeaf = IntelNode<IntelItem>;

export type IntelItem = IntelNode<string | [string, string]>;

export interface JIntmap {
    [entry: string]: string;
}
