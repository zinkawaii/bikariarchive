import type { JIntel, JIntmap } from "@bikari/process";

export class Entry {
    static meta: JIntel;
    static map: JIntmap;
}

export function enrichJIntel(original: any) {
    //将元数据引用注入原型
    Entry.meta = original;
}