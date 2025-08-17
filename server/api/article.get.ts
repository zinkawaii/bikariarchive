import { type } from "arktype";
import CryptoES from "crypto-es";
import { Article } from "~/utils/article";
import { ReadRecordModel } from "~~/server/models/ReadRecord";
import type { GetArticleResponse } from "~~/server/types/api/article";

const schema = type({
    novel: "string",
    index: "string",
    password: "string",
});

export default defineJEventHandler<GetArticleResponse>(async (event, res) => {
    const config = useRuntimeConfig();
    const { novel, index, password } = schema.assert(getQuery(event));

    //初始化
    const art = Article.for(novel, index);
    if (!art) {
        return 1;
    }

    //验证密码
    if (art.encrypted && password !== Article.map[novel][index].password) {
        return 2;
    }

    //连接数据库
    await connectMongoose();

    //读取文章
    res.body = await readArticle(art);

    //获取阅读量
    const qCounts = await ReadRecordModel.aggregate([
        {
            $match: {
                novel,
                index,
            },
        },
        {
            $group: {
                _id: {
                    ip: "$ip",
                    window: {
                        $dateTrunc: {
                            date: "$time",
                            unit: "hour",
                            binSize: 8,
                        },
                    },
                },
            },
        },
        {
            $count: "count",
        },
    ]);

    res.readCount = qCounts.length ? qCounts[0].count : 0;

    //生成代币
    const token = {
        novel,
        index,
    };

    res.token = CryptoES.AES.encrypt(JSON.stringify(token), config.article.key).toString();
});
