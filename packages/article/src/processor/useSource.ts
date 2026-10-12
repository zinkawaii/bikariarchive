import { join, relative } from "pathe";
import { useCurrentContext } from "./kerria.ts";
import { type MaybePromise, toArray, writeJson } from "./utils.ts";

export interface SourceInfo extends UseSourceOptions {
  kind: number;
  folders: string[];
  patterns: string[];
  filter: (path: string) => boolean;
  output: (path: string, data: any) => MaybePromise<void>;
}

export interface UseSourceOptions<T = any> {
  base: string | string[];
  dist?: string;
  ext: string;
  deep?: boolean;
  skip?: number;
  parse: (path: string, info: SourceInfo) => MaybePromise<T | null | void>;
  cache?: (cache: T) => void;
  unlink?: (cache: T) => MaybePromise<void>;
}

export function useSource<T extends object>(kind: number, options: UseSourceOptions<T>) {
  const ctx = useCurrentContext();
  const {
    deep = true,
    skip = 0,
  } = options;

  const folders = toArray(options.base).map((base) => join(ctx.base, base));
  const dist = options.dist && join(ctx.base, options.dist);
  const patterns = folders.map((path) => join(path, (deep ? "**/*" : "*") + options.ext));

  const info: SourceInfo = {
    ...options,
    kind,
    folders,
    patterns,
    dist,
    deep,
    skip,
    filter(path) {
      const depth = path.split("/").length - folders[0].split("/").length;
      return skip < depth;
    },
    output(path, data) {
      if (dist === void 0) {
        return;
      }
      const base = matchAncestor(path, folders);
      const outPath = join(dist, relative(base, path)).replace(info.ext, ".json");
      return writeJson(outPath, data);
    },
  };
  ctx.sourceInfos.push(info);

  return info;
}

function matchAncestor(path: string, folders: string[]) {
  for (const folder of folders) {
    if (relative(folder, path).startsWith("../")) {
      continue;
    }
    return folder;
  }
  throw new Error("找不到祖先。");
}
