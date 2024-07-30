import type { CodeToHastOptions } from "shiki";

//可复用正则表
export const Zexp = {
    email: /^[-\w]+@(?:[-\w]+\.)+[-\w]+$/,
    url: /^https?:\/\/(?:[-\w]+\.)+[-\w]+(?::\d+)?(?:\/.*)?$/
};

//通用代码高亮配置
export const highlightOptions: Partial<CodeToHastOptions> = {
    transformers: [{
        root: (hast) => ({
            type: "root",
            children: (hast.children[0] as any).children[0].children
        })
    }]
};

//获取字符串实际长度
export function getByteLength(str: string) {
    return str?.replace(/\u0391-\uFFE5/g, "__")?.length || 0;
}

//获取元素绝对位置
export function getPosition(element: Element) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;
    return {
        top,
        left
    };
}

//获取单个数组的随机项
export function getRandomItem<T>(arr: T[]) {
    const i = Zin.randInt(0, arr.length - 1);
    return arr[i];
}

//获取多个数组的同下标随机项
export function getRandomItems<T extends any[][]>(...arrs: T) {
    const length = arrs.reduce((res, arr) => Math.min(res, arr.length), Number.POSITIVE_INFINITY);
    const i = Zin.randInt(0, length);
    return arrs.map((arr) => arr[i]) as {
        [K in keyof T]: T[K][number]
    };
}

//判断焦点是否位于可编辑元素内
export function isFocusedEditable() {
    const focusedElement = document.activeElement;
    const tagName = focusedElement.tagName.toLowerCase();
    return (
        ["input", "textarea"].includes(tagName) ||
        focusedElement.hasAttribute("contenteditable")
    );
}

//以换行符切分字符串
export function splitByNewline(text: string) {
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