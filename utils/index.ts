//获取字符串实际长度
export function getByteLength(str: string) {
    return str?.replace(/\u0391-\uFFE5/g, "__")?.length || 0;
}

//获取元素绝对位置
export function getPosition(element: HTMLElement) {
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