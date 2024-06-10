import $ from "node-html-parser";
import dayjs from "dayjs";
import { Article } from "~/utils/Article";
import type { GetSearchResponse } from "~/server/types/api/search";

export default defineJEventHandler<GetSearchResponse>(async (event, res) => {
    let { novel, word } = getQueryValues(event);

    //空关键词
    if (!word?.length) {
        return 1;
    }

    //限制长度
    word = word.slice(0, 64);

    const jNovels = novel === void 0 ? Object.values(Article.meta) : [Article.meta[novel]];
    const jChapters = jNovels.flatMap((jNovel) => jNovel?.chapters).filter(Boolean);

    //按章节遍历
    res.list = [];
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
            const parts = [...Array(end - start)].map((_, i) => lines[i + start].outerHTML);

            res.list.push({
                novel: art.novel,
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
});