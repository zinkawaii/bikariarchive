import { readFile } from "node:fs/promises";

export interface ReadJsonPaginatedOptions {
    page: number;
    sizes: number;
}

export async function readJsonPaginated<T>(path: string, options: ReadJsonPaginatedOptions) {
    const {
        page,
        sizes,
    } = options;

    const file = await readFile(r(path), "utf-8");
    const data: T[] = JSON.parse(file);

    const { length: total } = data;
    const start = (page - 1) * sizes;
    const end = start + sizes;

    return {
        total,
        data: data.slice(start, end),
    };
}
