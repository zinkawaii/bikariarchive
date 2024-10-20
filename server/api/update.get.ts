import fs from "fs-extra";
import { z } from "zod";
import type { GetUpdateResponse } from "~~/server/types/api/update";

const schema = z.object({
    year: z.string().transform(Number)
});

export default defineJEventHandler<GetUpdateResponse>(async (event, res) => {
    const { year } = schema.parse(getQuery(event));

    //超出年份
    if (![2023, 2024].includes(year)) {
        return 1;
    }

    //读取数据
    res.list = await fs.readJSON(r(`/dist/update/${year}.json`));
});