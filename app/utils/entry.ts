import { reactive } from "vue";
import type { JIntel, JIntmap } from "@bikari/article";

export class Entry {
    static meta = reactive({} as JIntel);
    static map: JIntmap;
}

//将元数据引用注入原型
export function enrichJIntel(original: JIntel) {
    Object.assign(Entry.meta, original);
}