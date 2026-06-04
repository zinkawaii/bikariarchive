import { readFile } from "node:fs/promises";
import { type } from "arktype";
import { getQuery } from "nitro/h3";
import type { JEntry } from "@bikari/article";
import { Entry } from "#shared/utils/entry";

export type GetEntryQuery = typeof schema.inferIn;

export interface GetEntryResponse extends JEntry {
    category: string;
}

const schema = type({
    title: "string",
});

export default defineJEventHandler<{
    query: GetEntryQuery;
}, GetEntryResponse>(async (event, res) => {
    const { title } = schema.assert(getQuery(event));

    const category = Entry.map[title];

    //词条不存在
    if (!category) {
        return 1;
    }

    const path = r(`/.data/${category}/${title}.json`);
    const data = await readFile(path, "utf-8").then(JSON.parse);

    res.category = category;
    Object.assign(res, data);
});
