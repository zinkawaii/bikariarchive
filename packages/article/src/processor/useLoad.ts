import { resolve } from "pathe";
import { useCurrentContext } from "./kerria.ts";
import { writeJsonSync } from "./utils.ts";

export interface LoadInfo extends Omit<UseLoadOptions, "defaultValue" | "output"> {
  name: string;
  value: any;
  output: () => void;
}

export interface UseLoadOptions {
  dist?: string;
  defaultValue?: unknown;
  update?: (newVal: any, oldVal: any) => any;
  output?: (val: any) => any;
}

export function useLoad(name: string, options: UseLoadOptions) {
  const ctx = useCurrentContext();
  const {
    defaultValue = {},
    update,
    output,
  } = options;

  const dist = options.dist && resolve(options.dist);

  const info: LoadInfo = {
    name,
    dist,
    value: defaultValue,
    update,
    output() {
      if (dist === void 0) {
        return;
      }
      const data = output?.(info.value) ?? info.value;
      writeJsonSync(dist, data);
    },
  };
  ctx.loadInfos.push(info);
  update?.(info.value, void 0);

  return info;
}
