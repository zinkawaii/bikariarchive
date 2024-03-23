import dayjs from "dayjs";
import Mail from "~/server/core/Mail";

interface PostCommentResponse extends BaseResponse {}

export default defineCustomHandler(async (event) => {
    const res: PostCommentResponse = { error: 0 };
    let {
        path,
        parent,
        content,
        nickname,
        email,
        address
    } = await readBody(event);

    path = getStrictPath(path);
    if (path) {
        //获取时间，UID
        const time = dayjs.tz();
        const uid = event.context.session?.uid;

        //获取用户
        const user = await UserDataModel.findOne({ uid });

        //规制参数类型
        parent = parent || void(0);

        //将评论数据写入数据库
        const comment = await CommentDataModel.create({
            path,
            parent,
            content,
            time,
            nickname,
            email,
            address,
            ip: getRequestIP(event, { xForwardedFor: true }),
            user: user?._id
        });

        //更新所回复评论的数据（如果有）
        const res = await CommentDataModel.findOneAndUpdate({
            _id: parent
        }, {
            $push: {
                children: comment._id
            }
        });

        //对被回复评论进行邮件通知
        if (res !== null && res.email.length > 0 && res.email !== email) {
            sendMail({
                to: res.email,
                title: `@${nickname} 回复了您的评论`,
                template: "comment-reply",
                props: { content, path }
            });
        }
    }
    else {
        //路径格式错误
        res.error = 1;
    }

    return res;
});