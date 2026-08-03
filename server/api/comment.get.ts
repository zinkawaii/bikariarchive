import { type } from "arktype";
import { getQuery } from "nitro/h3";
import type { HydratedDocument } from "mongoose";
import { CommentDataModel } from "#server/models/CommentData";
import type { CommentData } from "#server/types/comment";
import type { CommentDataSchema } from "#server/types/model";

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

// 需要获取的属性
const select = "_id root parent content time nickname email address";

export default defineJEventHandler<{
  query: GetCommentQuery;
}, GetCommentResponse>(async (event, res) => {
  const body = schema.assert(getQuery(event));

  // 获取严格路径
  const path = getStrictPath(body.path);

  // 路径格式错误
  if (!path) {
    throw 1;
  }

  // 连接数据库
  await connectMongoose();

  // 单页评论数
  const limit = 10;

  // 总评论数
  res.totalCount = await CommentDataModel.countDocuments({
    path,
  });

  // 主评论数
  res.mainCount = await CommentDataModel.countDocuments({
    path,
    parent: null,
  });

  // 获取主评论
  const qComments = await CommentDataModel.find({
    path,
    parent: null,
  }, select)
    .sort({ time: "desc" })
    .skip((body.page - 1) * limit)
    .limit(limit);

  // 获取子评论
  res.list = await Promise.all(
    qComments.map(async (comment) => {
      const children = await CommentDataModel.find({
        root: comment._id,
      }, select);
      return transformComment(comment, children);
    }),
  );
});

function transformComment<T extends HydratedDocument<CommentDataSchema>>(
  item: T,
  all: T[],
): CommentData {
  const children = all
    .filter(({ parent }) => parent?.toString() === item._id.toString())
    .map((child) => transformComment(child, all));

  return {
    id: item._id.toString(),
    children,
    content: item.content,
    time: item.time.toISOString(),
    nickname: item.nickname,
    avatar: item.email ? generateAvatarUrl(item.email) : void 0,
    address: item.address,
  };
}
