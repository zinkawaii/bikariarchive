import fs from "fs-extra";
import { defineCustomHandler } from "../utils/handler";
import getQueryValues from "../utils/getQueryValues";

interface GetEntryResponse extends BaseResponse {
    [key: string]: any
};

export default defineCustomHandler(async (event) => {
    const res: GetEntryResponse = { error: 0 };
    const {
        category,
        title
    } = getQueryValues(event);

    const folders = ["area", "character", "concept"];
    if (folders.includes(category)) {
        const path = `data/${category}/${title}.json`;
        const isExist = await fs.exists(path);

        if (isExist) {
            const file = await fs.readFile(path);
            const data = JSON.parse(file.toString());
            Object.assign(res, data);
        }
        else {
            res.error = 2;
        }
    }
    else {
        res.error = 1;
    }

    return res;
});