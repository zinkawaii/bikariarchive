import { type } from "arktype";
import type { BangumiData, GetBangumiResponse } from "~~/server/types/api/bangumi";

const schema = type({
    page: "string.numeric.parse",
});

export default defineJEventHandler<GetBangumiResponse>(async (event, res) => {
    const { page } = schema.assert(getQuery(event));

    if (page <= 0) {
        return 1;
    }

    const sizes = 30;
    const {
        total,
        data,
    } = await readJsonPaginated<BangumiData>("/.data/json/Bangumi.json", {
        page,
        sizes,
    });

    if (!data.length) {
        return 2;
    }

    res.total = total;
    res.sizes = sizes;
    res.list = data;
});
