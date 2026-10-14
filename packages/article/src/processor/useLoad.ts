import { join } from "pathe";
import { useCurrentContext } from "./kerria.ts";
import { writeJsonSync } from "./utils.ts";

export interface LoadInfo<T = {}> extends Omit<UseLoadOptions<T>, "defaultValue" | "output"> {
  name: string;
  value: T;
  output: () => void;
}

export interface UseLoadOptions<T> {
  dist?: string;
  defaultValue?: T;
  output?: (val: T) => any;
}

export function useLoad<T extends {}>(name: string, options: UseLoadOptions<T>) {
  const ctx = useCurrentContext();
  const {
    defaultValue = {},
    output,
  } = options;

  const dist = options.dist && join(ctx.base, options.dist);

  const info: LoadInfo<T> = {
    name,
    dist,
    value: defaultValue as T,
    output() {
      if (dist === void 0) {
        return;
      }
      const data = output?.(info.value) ?? info.value;
      writeJsonSync(dist, data);
    },
  };
  ctx.loadInfos.push(info);

  return info;
}
