import { readFile } from "node:fs/promises";
import { type } from "arktype";
import type { GetUpdateResponse } from "~~/server/types/api/update";

const schema = type({
    year: "string.numeric.parse",
});

export default defineJEventHandler<GetUpdateResponse>(async (event, res) => {
    const { year } = schema.assert(getQuery(event));

    const config = useRuntimeConfig();

    //年份不存在
    if (!config.public.totalYears.includes(year)) {
        return 1;
    }

    const path = r(`/.data/update/${year}.json`);
    const file = await readFile(path, "utf-8");
    res.list = JSON.parse(file);
});
