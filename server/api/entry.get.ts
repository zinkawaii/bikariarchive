import fs from "fs-extra";
import jEntry from "~/dist/json/Entry.json";

interface GetEntryResponse extends BaseResponse {
    [key: string]: any
}

export default defineCustomHandler(async (event) => {
    const res: GetEntryResponse = { error: 0 };
    const {
        category,
        title
    } = getQueryValues(event);

    if (Object.keys(jEntry.category).includes(category)) {
        const path = r(`data/${category}/${title}.json`);
        const isExist = await fs.exists(path);

        if (isExist) {
            const file = await fs.readFile(path);
            const data = JSON.parse(file.toString());
            Object.assign(res, data);
        }
        else {
            //词条不存在
            res.error = 2;
        }
    }
    else {
        //不在目录范围内
        res.error = 1;
    }

    return res;
});