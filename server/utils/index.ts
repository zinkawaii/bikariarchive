import { resolve } from "node:path";

//从根目录合并路径
export function r(path: string) {
    return resolve("." + path);
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
export function getStrictPath(path: string) {
    return path.split("?")[0].split("#")[0].replace(/[\\/]+$/, "");
}