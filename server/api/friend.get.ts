import fs from "fs-extra";

export default defineCustomHandler(async (event, res) => {
    const jFriend = await fs.readJson(r("assets/json/Friend.json"));
    Object.assign(res, jFriend);
});