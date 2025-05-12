import { readFile } from "node:fs/promises";
import { type } from "arktype";
import type { GetUpdateResponse } from "~~/server/types/api/update";

const schema = type({
    year: "string.numeric.parse",
});

export default defineJEventHandler<GetUpdateResponse>(async (event, res) => {
    const { year } = schema.assert(getQuery(event));

    //读取数据
    if ([2023, 2024, 2025].includes(year)) {
        const path = r(`/data/dist/update/${year}.json`);
        const file = await readFile(path, "utf-8");
        res.list = JSON.parse(file);
    }
    else {
        res.list = [];
    }
});
