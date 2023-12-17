//获取字符串实际长度
export function getByteLength(str: string) {
    return str?.replace(/\u0391-\uFFE5/g, "__")?.length || 0;
}

//以换行符切分字符串
export function toSplit(text: string) {
    return text?.split("\n");
}

//路由：词条
export function toEntry(title: string) {
    return {
        name: "entry",
        params: { title }
    };
}

//路由：全文检索
export function toSearch(word: string) {
    return {
        name: "search",
        query: { word }
    };
}