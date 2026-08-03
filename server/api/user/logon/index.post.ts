import { type } from "arktype";
import { TempCaptchaModel } from "#server/models/TempCaptcha";
import { UserDataModel } from "#server/models/UserData";
import { randomInt } from "#shared/utils/random";

export type GetLogonBody = typeof schema.inferIn;

export interface GetLogonResponse {
  uid: number;
  nickname: string;
  identity: number;
}

const schema = type({
  nickname: "string <= 18",
  email: "string.email",
  captcha: "string == 6",
  password: "12 <= string <= 24",
});

export default defineJEventHandler<{
  body: GetLogonBody;
}, GetLogonResponse>(async (event) => {
  const session = await readSession(event);
  const { nickname, email, captcha, password } = schema.assert(await event.req.json());

  // 连接数据库
  await connectMongoose();

  // 查询用户信息中是否存在该邮箱所注册的账号
  const qUser = await UserDataModel.findOne({ email });

  // 邮箱已注册
  if (qUser) {
    throw 1;
  }

  // 查询数据库中是否已存在该邮箱未处理的验证码
  const qCaptcha = await TempCaptchaModel.findOne({ email });

  // 验证码不存在
  if (!qCaptcha) {
    throw 2;
  }

  // 验证码已过期
  if (qCaptcha.time.getTime() + 1800000 < Date.now()) {
    throw 3;
  }

  // 验证码不正确
  if (captcha !== qCaptcha.captcha) {
    throw 4;
  }

  // 验证成功，从数据库中删除临时数据
  await TempCaptchaModel.deleteOne({ email }).exec();

  // UID
  const uid = createUid();

  // 性别
  const sex = 0;

  // 权限
  const identity = 1;

  // 创建时间
  const createTime = new Date();

  // 哈希和盐值
  const { hash, salt } = createSecret(password);

  // 新增用户信息
  await UserDataModel.insertMany({
    uid,
    nickname,
    email,
    sex,
    identity,
    createTime,
    hash,
    salt,
  });

  // 写入会话
  await session.update({
    uid,
    identity,
  });
});

// UID 生成
function createUid() {
  const uid = randomInt(10000, 100000);
  return uid;
}
