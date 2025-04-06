//可复用正则表
export const Zexp = {
    email: /^[-\w]+@(?:[-\w]+\.)+[-\w]+$/,
    nickname: /^[\w\u4E00-\u9FA5]{0,18}$/,
    password: /^\w{6,18}$/,
    url: /^https?:\/\/(?:[-\w]+\.)+[-\w]+(?::\d+)?(?:\/.*)?$/
};

//取中间值
export function clamp(min: number, x: number, max: number) {
    const mid = x > min ? x : min;
    return mid < max ? mid : max;
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

//判断焦点是否位于可编辑元素内
export function isFocusedEditable() {
    const el = document.activeElement as HTMLElement;
    const tag = el.tagName.toLowerCase();
    return ["input", "textarea"].includes(tag) || el.isContentEditable;
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