import { z } from "zod";
import type { BangumiData, GetBangumiResponse } from "~~/server/types/api/bangumi";

const schema = z.object({
    page: z.string().transform(Number)
});

export default defineJEventHandler<GetBangumiResponse>(async (event, res) => {
    const { page } = schema.parse(getQuery(event));

    if (page <= 0) {
        return 1;
    }

    const sizes = 32;
    const {
        total,
        data
    } = await readJsonPaginated<BangumiData>("/data/json/Bangumi.json", {
        page,
        sizes
    });

    if (!data.length) {
        return 2;
    }

    res.total = total;
    res.sizes = sizes;
    res.list = data;
});