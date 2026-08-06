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
  comments: CommentData[];
}

const schema = type({
  path: parseCommentPath,
  page: "string.numeric.parse",
});

// 需要获取的属性
const selectionKey = "root parent content time nickname email address status";

export default defineJEventHandler<{
  query: GetCommentQuery;
}, GetCommentResponse>(async (event, res) => {
  const query = schema.assert(getQuery(event));

  // 连接数据库
  await connectMongoose();

  // 评论状态
  const status = await isIdentityAdmin(event) ? void 0 : {
    status: "public" as const,
  };

  // 单页评论数
  const limit = 10;

  // 总评论数
  res.totalCount = await CommentDataModel.countDocuments({
    path: query.path,
    ...status,
  });

  // 主评论数
  res.mainCount = await CommentDataModel.countDocuments({
    path: query.path,
    parent: null,
    ...status,
  });

  // 获取主评论
  const comments = await CommentDataModel.find({
    path: query.path,
    parent: null,
    ...status,
  })
    .select(selectionKey)
    .sort({ time: "desc" })
    .skip((query.page - 1) * limit)
    .limit(limit);

  // 获取子评论
  res.comments = await Promise.all(
    comments.map(async (comment) => {
      const children = await CommentDataModel.find({
        root: comment._id,
      }).select(selectionKey);
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
    pending: item.status === "pending" || void 0,
  };
}
