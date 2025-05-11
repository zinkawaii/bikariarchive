import { type } from "arktype";
import fs from "fs-extra";
import type { GetUpdateResponse } from "~~/server/types/api/update";

const schema = type({
    year: "string.numeric.parse",
});

export default defineJEventHandler<GetUpdateResponse>(async (event, res) => {
    const { year } = schema.assert(getQuery(event));

    //读取数据
    res.list = [2023, 2024, 2025].includes(year)
        ? await fs.readJSON(r(`/data/dist/update/${year}.json`))
        : [];
});
