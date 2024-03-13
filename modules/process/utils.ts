import { resolve } from "path";

//从根目录合并路径
export function r(path: string) {
    return resolve("./", path);
}