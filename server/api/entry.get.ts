import fs from "fs-extra";
import jMap from "~/dist/json/Entrimap.json";

interface GetEntryResponse extends BaseResponse {
    [key: string]: any
}

export default defineCustomHandler(async (event) => {
    const res: GetEntryResponse = { error: 0 };
    const {
        title
    } = getQueryValues(event);

    if (title in jMap) {
        const category = jMap[title];
        const path = r(`data/${category}/${title}.json`);
        const file = await fs.readFile(path);
        const data = JSON.parse(file.toString());
        Object.assign(res, data);
    }
    else {
        //词条不存在
        res.error = 1;
    }

    return res;
});