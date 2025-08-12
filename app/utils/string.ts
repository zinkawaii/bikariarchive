//转义实体字符
export function escapeHtml(html: string) {
    return html
        .replaceAll(/&/g, "&amp;")
        .replaceAll(/</g, "&lt;")
        .replaceAll(/>/g, "&gt;")
        .replaceAll(/"/g, "&quot;")
        .replaceAll(/'/g, "&#039;");
}

//获取字符串实际长度
export function getByteLength(str: string) {
    return str.replaceAll(/\u0391-\uFFE5/g, "__").length;
}
