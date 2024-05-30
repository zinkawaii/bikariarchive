import dayjs from "dayjs";
import CryptoES from "crypto-es";
import type { PatchArticleBody } from "~/server/types/api/article";

export default defineJEventHandler(async (event, res) => {
    const config = useRuntimeConfig();
    const { token } = await readBody<PatchArticleBody>(event);

    const ip = getRequestIP(event, { xForwardedFor: true });
    const time = dayjs.tz().toDate();
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