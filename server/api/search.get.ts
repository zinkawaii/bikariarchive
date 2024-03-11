import $ from "node-html-parser";
import dayjs from "dayjs";
import { jArticle } from "~/utils/Article";

interface GetArticleResponse extends BaseResponse {
    results?: SearchResult[]
}

interface SearchResult {
    index: string,
    count: number,
    parts: string[]
}

export default defineCustomHandler(async (event) => {
    const res: GetArticleResponse = {
        error: 0,
        results: []
    };
    let { word } = getQueryValues(event);

    if (word && word.length > 0) {
        //限制长度
        word = word.slice(0, 64);

        const jNovel = jArticle.bikari;
        const jChapters = jNovel.chapters;

        //按章节遍历
        for (const art of jChapters) {
            //读取整章
            const text = await readArticle(art);
            if (!text) continue;

            //开始检索
            const doc = $.parse(text);
            const lines = doc.querySelectorAll("p");

            const position = [];
            for (let i = 0; i < lines.length; i++) {
                let pos = -1;
                const line = lines[i].textContent;

                do {
                    pos = line.indexOf(word, pos + 1);
                    if (pos !== -1) {
                        position.push({
                            line: i,
                            pos: pos
                        });
                    }
                } while (pos !== -1);
            }

            if (position.length > 0) {
                const line = position[0].line;

                //前后文
                const start = Math.max(line - 1, 0);
                const end = Math.min(line + 2, lines.length);
                const parts = [...new Array(end - start)].map((_, i) => lines[i + start].outerHTML);

                res.results.push({
                    index: art.index,
                    count: position.length,
                    parts: parts
                });
            }
        }

        //将检索记录写入数据库
        new SearchRecordModel({
            ip: getRequestIP(event, { xForwardedFor: true }),
            time: dayjs.tz(),
            word
        }).save();
    }

    return res;
});