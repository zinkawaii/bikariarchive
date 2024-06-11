import dayjs from "dayjs";
import type { PutCommentBody } from "~~/server/types/api/comment";

export default defineJEventHandler(async (event) => {
    const body = await readBody<PutCommentBody>(event);

    //权限验证
    identityValidate(event, 9);

    //获取时间
    const time = dayjs.tz();

    console.log(body);

    //更新评论数据
    await CommentDataModel.findOneAndUpdate({
        _id: body.id
    }, {
        content: body.content,
        updated: time,
        nickname: body.nickname,
        address: body.address
    });
});