import path from "path";

export function r(url: string) {
    const prefix = (process.env.NODE_ENV === "development") ? "./" : "../";
    return path.resolve(prefix, url);
}