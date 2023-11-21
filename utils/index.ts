//获取字符串实际长度
export function getByteLength(str: string) {
    return str.replace(/\u0391-\uFFE5/g, "__").length;
}

//获取元素绝对位置
export function getPosition<T extends HTMLElement>(e: T) {
    let top = 0;
    let left = 0;
    let current = e;

    do {
        top += current.offsetTop;
        left += current.offsetLeft;
        current = current.offsetParent as T;
    } while (current !== null);

    return {
        top,
        left
    };
}