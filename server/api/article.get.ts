import fs from "fs-extra";
import getQueryValues from "../utils/getQueryValues";

interface GetArticleResponse extends BaseResponse {
    content?: string
}

export default defineEventHandler(async (event) => {
    const res: GetArticleResponse = { error: 0 };
    const { novel, volOrder, index } = getQueryValues(event);

    try {
        if (novel) {
            const path = `dist/novel/${novel[0].toUpperCase() + novel.slice(1)}.${volOrder}/${index}.txt`;
            const isExist = await fs.exists(path);

            if (isExist) {
                const file = await fs.readFile(path);
                res.content = file.toString();
            }
            else {
                res.error = 2;
            }
        }
        else {
            res.error = 1;
        }
    }
    catch (err) {
        res.error = 100;
    }
    finally {
        return res;
    }
});