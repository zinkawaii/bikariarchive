import fs from "fs-extra";
import type { GetFriendResponse } from "~/server/types/api/friend";

export default defineJEventHandler<GetFriendResponse>(async (event, res) => {
    const jFriend = await fs.readJson(r("/assets/json/Friend.json"));
    Object.assign(res, jFriend);
});