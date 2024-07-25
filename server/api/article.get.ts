import CryptoES from "crypto-es";
import { Article } from "~/utils/Article";
import type { GetArticleResponse } from "~~/server/types/api/article";

export default defineJEventHandler<GetArticleResponse>(async (event, res) => {
    const config = useRuntimeConfig();
    const { novel, index, password } = getQueryValues(event);

    //初始化
    const art = Article.for(novel, index);

    //验证密码
    if (art.encrypted && password !== Article.map[novel][index].password) {
        return 1;
    }

    //读取文章
    res.content = await readArticle(art);

    //获取阅读量
    const qRecords = await ReadRecordModel.find({
        novel,
        index
    }, "ip time");

    //处理阅读量
    const interval = 8 * 60 * 60 * 1000;
    const records: Record<string, {
        count: number;
        time: number;
    }> = {};
    for (const { ip, time } of qRecords) {
        if (ip in records) {
            const next = time.getTime();
            const last = records[ip].time;

            //同IP下阅读间隔大于8小时
            if (next - last >= interval) {
                records[ip].count++;
                records[ip].time = next;
            }
        }
        else {
            records[ip] = {
                count: 1,
                time: time.getTime()
            };
        }
    }

    //统计阅读量
    res.readCount = 0;
    for (const ip in records) {
        res.readCount += records[ip].count;
    }

    //生成代币
    const token = {
        novel,
        index
    };

    res.token = CryptoES.AES.encrypt(JSON.stringify(token), config.article.key).toString();
});