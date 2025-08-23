import { type } from "arktype";
import CommentReply from "~/emails/comment-reply.vue";
import { Zexp } from "~/utils";
import { CommentDataModel } from "~~/server/models/CommentData";
import { UserDataModel } from "~~/server/models/UserData";
import type { PostCommentBody } from "~~/server/types/api/comment";
import type { CommentDataSchema, UserDataSchema } from "~~/server/types/model";

const schema = type({
    path: "string",
    parent: "string?",
    content: "string <= 512",
    nickname: type(Zexp.nickname),
    email: type(Zexp.email).optional(),
    address: type(Zexp.url).optional(),
});

export default defineJEventHandler(async (event) => {
    const { session } = event.context;
    const config = useRuntimeConfig();
    const body = schema.assert(
        await readBody<PostCommentBody>(event),
    );

    //获取严格路径
    const path = getStrictPath(body.path);

    //路径格式错误
    if (!path) {
        return 1;
    }

    //权限验证
    identityValidate(event, Reflect.get(config.comment, path)?.identity ?? 0);

    //连接数据库
    await connectMongoose();

    const time = new Date();
    const uid = event.context.session?.uid;
    const mode = session.uid !== 0 ? "user" : "guest";

    let info:
        | Pick<CommentDataSchema, "nickname" | "email" | "address">
        | Pick<CommentDataSchema, "user">;

    if (mode === "guest") {
        //无游客昵称
        if (!body.nickname) {
            return 2;
        }

        info = {
            nickname: body.nickname,
            email: body.email,
            address: body.address,
        };
    }
    else {
        //获取用户
        const qUser = await UserDataModel.findOne({ uid });

        //用户不存在
        if (!qUser) {
            return 3;
        }

        info = {
            user: qUser.id,
        };
    }

    //获取所回复评论的数据（如果有）
    const qParent = await CommentDataModel.findOne({
        _id: body.parent,
    }).populate<{
        user?: UserDataSchema;
    }>({
        path: "user",
        select: "email",
    });

    //将评论数据写入数据库
    await CommentDataModel.create({
        path,
        root: qParent?.root ?? qParent?._id,
        parent: body.parent,
        content: body.content,
        time,
        updated: time,
        ip: getRequestIP(event, { xForwardedFor: true }),
        mode,
        ...info,
    });

    if (!qParent) {
        return;
    }

    //获取回复邮箱
    const email = qParent.mode === "guest" ? qParent.email : qParent.user?.email;

    //对被回复评论进行邮件通知
    if (email && email !== body.email) {
        sendMail(CommentReply, {
            to: email,
            title: `@${body.nickname} 回复了您的评论`,
            props: {
                content: body.content,
                path,
            },
        });
    }
});
