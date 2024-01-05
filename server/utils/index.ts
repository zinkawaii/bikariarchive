import path from "path";

//获取绝对路径
export function r(url: string) {
    const prefix = (process.env.NODE_ENV === "development") ? "./" : "../";
    return path.resolve(prefix, url);
}

//获取查询参数
export function getQueryValues(event: any) {
    const query = getQuery(event);
    const obj: {
        [T in any]: string | undefined
    } = {};

    for (const key in query) {
        obj[key] = query[key]?.toString();
    }
    return obj;
}

//获取无尾斜杠路径
const pathRegexp = /^((?:\/[\w-]+)+)\/?$/;
export function getStrictPath(path: string) {
    const match = path.match(pathRegexp);
    return match ? match[1] : null;
}