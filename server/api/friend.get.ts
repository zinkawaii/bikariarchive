import fs from "fs-extra";

export default defineJEventHandler(async (event, res) => {
    const jFriend = await fs.readJson(r("assets/json/Friend.json"));
    Object.assign(res, jFriend);
});