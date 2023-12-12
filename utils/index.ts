//获取字符串实际长度
export function getByteLength(str: string) {
    return str?.replace(/\u0391-\uFFE5/g, "__")?.length || 0;
}