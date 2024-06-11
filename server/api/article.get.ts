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
    const file = await readArticle(art);
    res.content = file.toString();

    //获取阅读量
    const qRecord = await ReadRecordModel.find({
        novel,
        index
    }, "ip time");

    //处理阅读量
    const interval = 8 * 60 * 60 * 1000;
    const rlist: {
        [T: string]: {
            count: number;
            time: number;
        };
    } = {};
    for (const record of qRecord) {
        const ip = record.ip;
        if (ip in rlist) {
            const next = record.time.getTime();
            const last = rlist[ip].time;

            //同IP下阅读间隔大于8小时
            if (next - last >= interval) {
                rlist[ip].count++;
                rlist[ip].time = next;
            }
        }
        else {
            rlist[ip] = {
                count: 1,
                time: record.time.getTime()
            };
        }
    }

    //统计阅读量
    res.readCount = 0;
    for (const ip in rlist) {
        res.readCount += rlist[ip].count;
    }

    //生成代币
    const token = {
        novel,
        index
    };

    res.token = CryptoES.AES.encrypt(JSON.stringify(token), config.article.key).toString();
});