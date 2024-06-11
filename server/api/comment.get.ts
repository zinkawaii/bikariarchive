import CryptoES from "crypto-es";
import type { HydratedDocument } from "mongoose";
import type { CommentDataSchema } from "~~/server/types/model";
import type { CommentData, GetCommentResponse } from "~~/server/types/api/comment";

//需要获取的属性
const select = "_id content children time nickname email address";

export default defineJEventHandler<GetCommentResponse>(async (event, res) => {
    let {
        path,
        page
    } = getQueryValues(event);

    //获取严格路径
    path = getStrictPath(path);

    //路径格式错误
    if (!path) {
        return 1;
    }

    //单页评论数
    const limit = 10;

    //总评论数
    res.totalCount = await CommentDataModel.countDocuments({
        path
    });

    //主评论数
    res.mainCount = await CommentDataModel.countDocuments({
        path,
        parent: null
    });

    //获取主评论
    const qComments = await CommentDataModel.find({
        path,
        parent: null
    }, select)
    .sort({ time: "desc" })
    .skip((Number(page) - 1) * limit)
    .limit(limit);

    //获取子评论
    res.list = await deference(qComments);
});

//递归解引用
async function deference(parent: HydratedDocument<CommentDataSchema>[]) {
    return await Promise.all(
        parent.map(async (item) => {
            const children = item.children.length ? await deference(
                (await item.populate<{
                    children: typeof parent;
                }>({
                    path: "children",
                    select
                })).children
            ) : [];

            return <CommentData> {
                id: item.id,
                children,
                content: item.content,
                time: item.time.toString(),
                nickname: item.nickname,
                avatar: `https://cravatar.cn/avatar/${CryptoES.MD5(item.email)}?d=404`,
                address: item.address
            };
        })
    );
}