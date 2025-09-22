//获取元素绝对位置
export function getPosition(element: Element) {
    const { top, left } = element.getBoundingClientRect();
    return {
        top: top + window.scrollY,
        left: left + window.scrollX,
    };
}

//判断焦点是否位于可编辑元素内
export function isFocusedEditable() {
    const el = document.activeElement as HTMLElement;
    const tag = el.tagName.toLowerCase();
    return ["input", "textarea"].includes(tag) || el.isContentEditable;
}
