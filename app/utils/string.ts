//转义实体字符
export function escapeHtml(html: string) {
    return html
        .replaceAll(/&/g, "&amp;")
        .replaceAll(/</g, "&lt;")
        .replaceAll(/>/g, "&gt;")
        .replaceAll(/"/g, "&quot;")
        .replaceAll(/'/g, "&#039;");
}

//首字母大写
export function capitalize<T extends string>(str: T) {
    return (
        str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : ""
    ) as Capitalize<T>;
}

//连字符转换
export function hyphenate(str: string) {
    return getSplittedGroup(str)
        .join("-")
        .toLowerCase();
}

//下划线转换
export function underlize(str: string) {
    return getSplittedGroup(str)
        .join("_")
        .toLowerCase();
}

//小驼峰转换
export function camelize(str: string) {
    return getSplittedGroup(str)
        .map((sub, i) => (i ? capitalize(sub) : sub.toLowerCase()))
        .join("");
}

//大驼峰转换
export function pascalize(str: string) {
    return getSplittedGroup(str)
        .map(capitalize)
        .join("");
}

//获取字符串实际长度
export function getByteLength(str: string) {
    return str.replaceAll(/\u0391-\uFFE5/g, "__").length;
}

//获取转换用切分数组
function getSplittedGroup(str: string) {
    return str
        .replaceAll(/[A-Z]+(?=[A-Z][a-z0-9]|[^A-Z])/g, capitalize)
        .split(/(?=[A-Z])|[_.\-\s]/);
}
