import { readFile } from "node:fs/promises";
import type { GetFriendResponse } from "~~/server/types/api/friend";

export default defineJEventHandler<GetFriendResponse>(async (event, res) => {
    const path = r("/data/json/Friend.json");
    const file = await readFile(path, "utf-8");
    res.list = JSON.parse(file);
});
