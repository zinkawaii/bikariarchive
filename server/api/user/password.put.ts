import { z } from "zod";
import { Zexp } from "~/utils";
import type { PutPasswordBody } from "~~/server/types/api/user/password";

const schema = z.object({
    old: z.string().regex(Zexp.password),
    new: z.string().regex(Zexp.password)
});

export default defineJEventHandler(async (event) => {
    const { session } = event.context;
    const { old: oldPassword, new: newPassword } = schema.parse(
        await readBody<PutPasswordBody>(event)
    );

    //权限验证
    identityValidate(event, 1);

    const qUser = await UserDataModel.findOne({
        uid: session.uid
    }, "hash salt");

    //账号不存在
    if (!qUser) {
        return 1;
    }

    let { hash, salt } = qUser;

    //密码错误
    if (hash !== InnerCode.encrypt(oldPassword, salt)) {
        return 2;
    }

    //更新哈希和盐值
    ({ hash, salt } = InnerCode.create(newPassword));

    //更新用户信息
    await qUser.updateOne({
        hash,
        salt
    });
});