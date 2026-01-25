import { type } from "arktype";
import { AES } from "crypto-es";
import { Article } from "#shared/utils/article";
import type { GetArticleResponse } from "#server/types/api/article";

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

    //生成代币
    const token = {
        novel,
        index,
    };

    res.token = AES.encrypt(JSON.stringify(token), config.article.key).toString();
});
