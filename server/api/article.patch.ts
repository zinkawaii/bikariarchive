import { type } from "arktype";
import CryptoES from "crypto-es";
import { ReadRecordModel } from "~~/server/models/ReadRecord";
import { UserDataModel } from "~~/server/models/UserData";
import type { PatchArticleBody } from "~~/server/types/api/article";

const schema = type({
    token: "string",
});

export default defineJEventHandler(async (event, res) => {
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
    }
    catch {
        //代币解析错误
        res.error = 1;
    }
});
