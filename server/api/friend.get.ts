import fs from "fs-extra";
import type { GetFriendResponse } from "~~/server/types/api/friend";

export default defineJEventHandler<GetFriendResponse>(async (event, res) => {
    res.list = await fs.readJson(r("/app/assets/json/Friend.json"));
});