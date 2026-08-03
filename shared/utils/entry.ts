import { reactive } from "vue";
import type { JIntel } from "@bikari/article";

export class Entry {
  static meta = reactive({} as JIntel);

  static async for(title: string) {
    if (!(title in this.meta.entries)) {
      throw new Error(`Entry(${title}) is invalid.`);
    }

    return this.meta.entries[title] ??= (
      await import(`#data/entry/${title}.json`)
    ).default;
  }
}

// 将元数据引用注入原型
export function enrichJIntel(original: JIntel) {
  Object.assign(Entry.meta, original);
}
