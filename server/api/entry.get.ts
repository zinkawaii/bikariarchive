import fs from "fs-extra";
import { Entry } from "~/utils/entry";
import type { GetEntryResponse } from "~~/server/types/api/entry";

export default defineJEventHandler<GetEntryResponse>(async (event, res) => {
    const {
        title
    } = getQueryValues(event);

    //词条不存在
    if (!(title in Entry.map)) {
        return 1;
    }

    const category = Entry.map[title];
    const path = r(`/dist/${category}/${title}.json`);
    const data = await fs.readJson(path);

    res.category = category;
    Object.assign(res, data);
});