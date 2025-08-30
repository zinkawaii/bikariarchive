import { resolve } from "pathe";

export function resolveRoot(path: string) {
    return resolve(import.meta.dirname, "../../.." + path);
}
