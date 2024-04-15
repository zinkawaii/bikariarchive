import fs from "fs-extra";
import jMap from "~/dist/json/Entrimap.json";

interface GetEntryResponse extends BaseResponse {
    [key: string]: any
}

export default defineCustomHandler<GetEntryResponse>(async (event, res) => {
    const {
        title
    } = getQueryValues(event);

    if (title in jMap) {
        const category = jMap[title];
        const path = r(`dist/${category}/${title}.json`);
        const data = await fs.readJson(path);

        res.category = category;
        Object.assign(res, data);
    }
    else {
        //词条不存在
        res.error = 1;
    }
});