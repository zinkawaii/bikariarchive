import dayjs from "dayjs";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";
import type { Element } from "@bikari/process";
import { Article } from "~/utils/article";
import type { GetSearchResponse } from "~~/server/types/api/search";

export default defineJThrottledEventHandler<GetSearchResponse>(async (event, res) => {
    let { novel, word = "" } = getQueryValues(event);

    //限制长度
    word = word.slice(0, 64).trim();

    //空关键词
    if (!word.length) {
        return 1;
    }

    const jNovels = novel === void 0 ? Object.values(Article.meta) : [Article.meta[novel]];
    const jChapters = jNovels.flatMap((jNovel) => jNovel?.chapters).filter(Boolean);

    //按章节遍历
    res.list = [];
    for (const art of jChapters) {
        //读取整章
        const root = await readArticle(art);

        //开始检索
        const lines: [Element, string][] = [];
        visit(root, "element", (node) => {
            if (node.tag === "p") {
                lines.push([node, toString(node)]);
            }
        });

        const position = [];
        for (let i = 0; i < lines.length; i++) {
            let pos = -1;
            const line = lines[i][1];

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
            const parts = [...new Array(end - start)].map((_, i) => lines[i + start][0]);

            res.list.push({
                novel: art.novel,
                index: art.index,
                count: position.length,
                parts
            });
        }
    }

    //将检索记录写入数据库
    new SearchRecordModel({
        ip: getRequestIP(event, { xForwardedFor: true }),
        time: dayjs.tz(),
        word
    }).save();
}, 1500);