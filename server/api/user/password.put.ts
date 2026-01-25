import { type } from "arktype";
import { UserDataModel } from "#server/models/UserData";
import { Zexp } from "#shared/utils";
import type { PutPasswordBody } from "#server/types/api/user/password";

const schema = type({
    old: type(Zexp.password),
    new: type(Zexp.password),
});

export default defineJEventHandler(async (event) => {
    const session = await readSession(event);
    const { old: oldPassword, new: newPassword } = schema.assert(
        await readBody<PutPasswordBody>(event),
    );

    //权限验证
    validateIdentity(session.data, 1);

    //连接数据库
    await connectMongoose();

    const qUser = await UserDataModel.findOne({
        uid: session.data.uid,
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
        salt,
    });
});
