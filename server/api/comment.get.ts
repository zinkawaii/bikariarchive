import { type } from "arktype";
import { getQuery } from "nitro/h3";
import type { HydratedDocument } from "mongoose";
import { CommentDataModel } from "#server/models/CommentData";
import type { CommentData } from "#server/types/comment";
import type { CommentDataSchema, UserDataSchema } from "#server/types/model";

export type GetCommentQuery = typeof schema.inferIn;

export interface GetCommentResponse {
    totalCount: number;
    mainCount: number;
    list: CommentData[];
}

const schema = type({
    path: "string",
    page: "string.numeric.parse",
});

//需要获取的属性
const select = "_id root parent content time mode nickname email address user";

export default defineJEventHandler<{
    query: GetCommentQuery;
}, GetCommentResponse>(async (event, res) => {
    const session = await readSession(event);
    const body = schema.assert(getQuery(event));

    //获取严格路径
    const path = getStrictPath(body.path);

    //路径格式错误
    if (!path) {
        return 1;
    }

    //连接数据库
    await connectMongoose();

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
    res.list = await Promise.all(
        qComments.map(async (comment) => {
            const children = await CommentDataModel.find({
                root: comment._id,
            }, select);
            return transformComment(comment, children, {}, session.data.identity ?? 0);
        }),
    );
});

async function transformComment<T extends HydratedDocument<CommentDataSchema>>(
    item: T,
    all: T[],
    users: Record<string, UserDataSchema>,
    identity: number,
): Promise<CommentData> {
    let { nickname = "", email, address } = item;
    let character = "游客";

    if (item.mode === "user") {
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

    const children = await Promise.all(
        all
            .filter(({ parent }) => parent?.toString() === item._id.toString())
            .map((child) => transformComment(child, all, users, identity)),
    );

    return {
        id: item._id.toString(),
        children,
        content: item.content,
        time: item.time.toISOString(),
        mode: item.mode,
        nickname,
        avatar: email ? generateAvatarUrl(email) : void 0,
        email: identity >= 9 ? email : void 0,
        address,
        character,
    };
}
