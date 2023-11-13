import * as cheerio from "cheerio";
import dayjs from "dayjs";
import Article from "~/utils/Article";
import jArticle from "~/dist/json/Article.json";

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
    const { word } = getQueryValues(event);

    if (word && word.length > 0) {
        const jNovel = jArticle.bikari;
        const jChapter = jNovel.chapter;

        //按章节遍历
        for (const item of jChapter) {
            //初始化
            const art = new Article("bikari", item.index);

            //读取整章
            const text = await readArticle(art);
            if (!text) continue;

            //开始检索
            const $ = cheerio.load(text);
            const lines = $("p");

            const position = [];
            for (let i = 0; i < lines.length; i++) {
                let pos = -1;
                const line = lines.eq(i).text().toString();

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
                const parts = [];
                if (line > 0) {
                    parts.push(lines.eq(line - 1).html());
                }
                parts.push(lines.eq(line).html());
                if (line + 1 < lines.length) {
                    parts.push(lines.eq(line + 1).html());
                }

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