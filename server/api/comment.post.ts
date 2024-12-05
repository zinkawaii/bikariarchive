import dayjs from "dayjs";
import { z } from "zod";
import CommentReply from "~/emails/comment-reply.vue";
import { Zexp } from "~/utils";
import type { PostCommentBody } from "~~/server/types/api/comment";

const schema = z.object({
    path: z.string(),
    parent: z.string().optional().transform((val) => val || void 0),
    content: z.string().max(512),
    nickname: z.string().regex(Zexp.nickname),
    email: z.string().regex(Zexp.email).optional(),
    address: z.string().regex(Zexp.url).optional()
});

export default defineJEventHandler(async (event) => {
    const config = useRuntimeConfig();
    const body = schema.parse(
        await readBody<PostCommentBody>(event)
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
    const time = dayjs.tz();
    const uid = event.context.session?.uid;

    //获取用户
    const qUser = await UserDataModel.findOne({ uid });

    //将评论数据写入数据库
    const qComment = await CommentDataModel.create({
        path,
        parent: body.parent,
        content: body.content,
        time,
        updated: time,
        nickname: body.nickname,
        email: body.email,
        address: body.address,
        ip: getRequestIP(event, { xForwardedFor: true }),
        user: qUser?._id
    });

    //更新所回复评论的数据（如果有）
    const qParent = await CommentDataModel.findOneAndUpdate({
        _id: body.parent
    }, {
        $push: {
            children: qComment._id
        }
    });

    //对被回复评论进行邮件通知
    if (qParent?.email && qParent.email !== body.email) {
        sendMail(CommentReply, {
            to: qParent.email,
            title: `@${body.nickname} 回复了您的评论`,
            props: {
                content: body.content,
                path
            }
        });
    }
});