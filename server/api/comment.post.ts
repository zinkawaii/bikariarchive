import { type } from "arktype";
import CommentReply from "~/emails/comment-reply.vue";
import { Zexp } from "~/utils";
import { CommentDataModel } from "~~/server/models/CommentData";
import { UserDataModel } from "~~/server/models/UserData";
import type { PostCommentBody } from "~~/server/types/api/comment";
import type { UserDataSchema } from "~~/server/types/model";

const schema = type({
    path: "string",
    parent: "string?",
    content: "string <= 512",
    mode: `"guest" | "user"`,
    nickname: type(Zexp.nickname),
    email: type(Zexp.email).optional(),
    address: type(Zexp.url).optional(),
});

export default defineJEventHandler(async (event) => {
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

    //获取时间，UID
    const time = new Date();
    const uid = event.context.session?.uid;

    let extra = {};
    if (body.mode === "guest") {
        //无游客昵称
        if (!body.nickname) {
            return 2;
        }

        extra = {
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

        extra = {
            user: qUser.id,
        };
    }

    //将评论数据写入数据库
    const qComment = await CommentDataModel.create({
        path,
        parent: body.parent,
        content: body.content,
        time,
        updated: time,
        ip: getRequestIP(event, { xForwardedFor: true }),
        mode: body.mode,
        ...extra,
    });

    //更新所回复评论的数据（如果有）
    const qParent = await CommentDataModel.findOneAndUpdate({
        _id: body.parent,
    }, {
        $push: {
            children: qComment._id,
        },
    }).populate<{
        user?: UserDataSchema;
    }>({
        path: "user",
        select: "email",
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
