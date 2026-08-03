import type { JEntry } from "./entry.ts";

export interface JIntel {
  blocks: IntelBlock[];
  entries: Record<string, JEntry>;
  drafts: string[];
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
