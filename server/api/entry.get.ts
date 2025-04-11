import { type } from "arktype";
import fs from "fs-extra";
import { Entry } from "~/utils/entry";
import type { GetEntryResponse } from "~~/server/types/api/entry";

const schema = type({
    title: "string"
});

export default defineJEventHandler<GetEntryResponse>(async (event, res) => {
    const { title } = schema.assert(getQuery(event));

    const category = Entry.map[title];

    //词条不存在
    if (!category) {
        return 1;
    }

    const path = r(`/dist/${category}/${title}.json`);
    const data = await fs.readJson(path);

    res.category = category;
    Object.assign(res, data);
});