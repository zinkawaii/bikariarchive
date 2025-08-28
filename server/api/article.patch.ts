import { type } from "arktype";
import CryptoES from "crypto-es";
import { ReadRecordModel } from "~~/server/models/ReadRecord";
import { UserDataModel } from "~~/server/models/UserData";
import type { PatchArticleBody, PatchArticleResponse } from "~~/server/types/api/article";

const schema = type({
    token: "string",
});

export default defineJEventHandler<PatchArticleResponse>(async (event, res) => {
    const config = useRuntimeConfig();
    const { token } = schema.assert(
        await readBody<PatchArticleBody>(event),
    );

    //连接数据库
    await connectMongoose();

    const ip = getRequestIP(event, { xForwardedFor: true });
    const time = new Date();
    const uid = event.context.session?.uid;

    //获取用户
    const user = await UserDataModel.findOne({ uid });

    try {
        const { novel, index } = JSON.parse(
            CryptoES.AES.decrypt(token, config.article.key).toString(CryptoES.enc.Utf8),
        );

        //添加阅读记录
        await ReadRecordModel.create({
            ip,
            time,
            novel,
            index,
            user,
        });

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

        res.count = qCounts.length ? qCounts[0].count : 0;
    }
    catch {
        //代币解析错误
        res.error = 1;
    }
});
