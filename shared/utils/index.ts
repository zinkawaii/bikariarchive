//转义实体字符
export function escapeHtml(html: string) {
    return html
        .replaceAll(/&/g, "&amp;")
        .replaceAll(/</g, "&lt;")
        .replaceAll(/>/g, "&gt;")
        .replaceAll(/"/g, "&quot;")
        .replaceAll(/'/g, "&#039;");
}

//取中间值
export function clamp(min: number, x: number, max: number) {
    const mid = x > min ? x : min;
    return mid < max ? mid : max;
}
