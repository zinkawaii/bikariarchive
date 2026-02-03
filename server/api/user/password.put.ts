import { type } from "arktype";
import { UserDataModel } from "#server/models/UserData";
import type { PutPasswordBody } from "#server/types/api/user/password";

const schema = type({
    old: "12 <= string <= 24",
    new: "12 <= string <= 24",
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

    //密码错误
    if (qUser.hash !== encryptSecret(oldPassword, qUser.salt)) {
        return 2;
    }

    //更新哈希和盐值
    await qUser.updateOne(createSecret(newPassword));
});
