import { type } from "arktype";
import type { HydratedDocument } from "mongoose";
import { CommentDataModel } from "~~/server/models/CommentData";
import { generateAvatarUrl } from "~~/server/utils";
import type { CommentData, GetCommentResponse } from "~~/server/types/api/comment";
import type { CommentDataSchema, UserDataSchema } from "~~/server/types/model";

const schema = type({
    path: "string",
    page: "string.numeric.parse",
});

//需要获取的属性
const select = "_id children content time mode nickname email address user";

export default defineJEventHandler<GetCommentResponse>(async (event, res) => {
    const { session } = event.context;
    const body = schema.assert(getQuery(event));

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
        path,
    });

    //主评论数
    res.mainCount = await CommentDataModel.countDocuments({
        path,
        parent: null,
    });

    //获取主评论
    const qComments = await CommentDataModel.find({
        path,
        parent: null,
    }, select)
    .sort({ time: "desc" })
    .skip((body.page - 1) * limit)
    .limit(limit);

    //获取子评论
    res.list = await deference(qComments, {}, session.identity ?? 0);
});

//递归解引用
async function deference<
    T extends HydratedDocument<CommentDataSchema>,
>(
    parent: T[],
    users: Record<string, Pick<UserDataSchema, "nickname" | "email" | "address" | "identity">>,
    identity: number,
): Promise<CommentData[]> {
    return await Promise.all(
        parent.map(async (item) => {
            let { mode, nickname = "", email, address } = item;
            let character = "游客";

            if (mode === "user") {
                const key = String(item.user);
                const user = users[key] ??= (await item.populate<{
                    user: UserDataSchema;
                }>({
                    path: "user",
                    select: "nickname email address identity",
                })).user;

                nickname = user.nickname;
                email = user.email;
                address = user.address;
                character = user.identity >= 9 ? "站长" : "用户";
            }

            const children = item.children.length ? await deference(
                (await item.populate<{
                    children: T[];
                }>("children", select)).children,
                users,
                identity,
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
                address,
                character,
            };
        }),
    );
}
