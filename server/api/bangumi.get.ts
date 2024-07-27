import type { BangumiData, GetBangumiResponse } from "~~/server/types/api/bangumi";

export default defineJEventHandler<GetBangumiResponse>(async (event, res) => {
    const query = getQueryValues(event);

    const page = Number(query.page);
    const sizes = 32;

    if (!page) {
        return 1;
    }

    const {
        total,
        data
    } = await readJsonPaginated<BangumiData>("/app/assets/json/Bangumi.json", {
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