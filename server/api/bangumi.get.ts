import fs from "fs-extra";
import type { GetBangumiResponse } from "~/server/types/api/bangumi";

export default defineJEventHandler<GetBangumiResponse>(async (event, res) => {
    const jBangumi = await fs.readJson(r("/assets/json/Bangumi.json"));
    res.list = jBangumi;
});