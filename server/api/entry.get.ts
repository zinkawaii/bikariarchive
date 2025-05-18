import { readFile } from "node:fs/promises";
import { type } from "arktype";
import { Entry } from "~/utils/entry";
import type { GetEntryResponse } from "~~/server/types/api/entry";

const schema = type({
    title: "string",
});

export default defineJEventHandler<GetEntryResponse>(async (event, res) => {
    const { title } = schema.assert(getQuery(event));

    const category = Entry.map[title];

    //词条不存在
    if (!category) {
        return 1;
    }

    const path = r(`/.data/${category}/${title}.json`);
    const file = await readFile(path, "utf-8");
    const data = JSON.parse(file);

    res.category = category;
    Object.assign(res, data);
});
