import fs from "fs-extra";

export interface ReadJsonPaginatedOptions {
    page: number;
    sizes: number;
}

export async function readJsonPaginated<T>(path: string, options: ReadJsonPaginatedOptions) {
    const {
        page,
        sizes,
    } = options;

    const jData: T[] = await fs.readJson(r(path));

    const { length: total } = jData;
    const start = (page - 1) * sizes;
    const end = start + sizes;
    const data = jData.slice(start, end);

    return {
        total,
        data,
    };
}
