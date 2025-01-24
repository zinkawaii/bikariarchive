import CryptoES from "crypto-es";
import { z } from "zod";
import type { PatchArticleBody } from "~~/server/types/api/article";

const schema = z.object({
    token: z.string()
});

export default defineJEventHandler(async (event, res) => {
    const config = useRuntimeConfig();
    const { token } = schema.parse(
        await readBody<PatchArticleBody>(event)
    );

    const ip = getRequestIP(event, { xForwardedFor: true });
    const time = new Date();
    const uid = event.context.session?.uid;

    //获取用户
    const user = await UserDataModel.findOne({ uid });

    try {
        const { novel, index } = JSON.parse(
            CryptoES.AES.decrypt(token, config.article.key).toString(CryptoES.enc.Utf8)
        );

        //添加阅读记录
        await ReadRecordModel.create({
            ip,
            time,
            novel,
            index,
            user
        });
    }
    catch {
        //代币解析错误
        res.error = 1;
    }
});