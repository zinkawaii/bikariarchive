import { z } from "zod";
import type { HydratedDocument } from "mongoose";
import { generateAvatarUrl } from "~~/server/utils";
import type { CommentData, GetCommentResponse } from "~~/server/types/api/comment";
import type { CommentDataSchema, UserDataSchema } from "~~/server/types/model";

const schema = z.object({
    path: z.string(),
    page: z.string().transform(Number)
});

//需要获取的属性
const select = "_id children content time mode nickname email address user";

export default defineJEventHandler<GetCommentResponse>(async (event, res) => {
    const { session } = event.context;
    const body = schema.parse(getQuery(event));

    //获取严格路径
    const path = getStrictPath(body.path);

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
    .skip((body.page - 1) * limit)
    .limit(limit);

    //获取子评论
    res.list = await deference(qComments, session.identity ?? 0);
});

//递归解引用
async function deference<
    T extends HydratedDocument<CommentDataSchema>
>(parent: T[], identity: number): Promise<CommentData[]> {
    return await Promise.all(
        parent.map(async (item) => {
            let { mode, nickname = "", email } = item;

            if (mode === "user") {
                const { user } = await item.populate<{
                    user: UserDataSchema;
                }>({
                    path: "user",
                    select: "nickname email"
                });

                nickname = user.nickname;
                email = user.email;
            }

            const children = item.children.length ? await deference(
                (await item.populate<{
                    children: T[];
                }>("children", select)).children,
                identity
            ) : [];

            return {
                id: item.id,
                children,
                content: item.content,
                time: item.time.toString(),
                mode,
                nickname,
                avatar: generateAvatarUrl(email),
                email: identity >= 9 ? email : void 0,
                address: item.address
            };
        })
    );
}