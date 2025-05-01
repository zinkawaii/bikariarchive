import { isObject } from "@vueuse/core";
import type { WithParent } from "~/types";
import type { CommentData, DeleteCommentBody, PostCommentBody, PutCommentBody } from "~~/server/types/api/comment";

export const useCommentStore = defineStore("comment", () => {
    const comments = ref<WithParent<CommentData>[]>();
    const mainCount = ref(0);
    const totalCount = ref(0);
    const isEmpty = ref(false);

    const route = useRoute();
    const toastStore = useToastStore();

    //清空评论
    function clear() {
        comments.value = [];
        mainCount.value = 0;
        totalCount.value = 0;
        isEmpty.value = true;
    }

    //更新评论
    async function update(page: number) {
        const res = await $fetch("/api/comment", {
            query: {
                path: route.path,
                page: page,
            },
        });
        if (res.error) {
            return;
        }

        comments.value = processComments(res.list);
        mainCount.value = res.mainCount;
        totalCount.value = res.totalCount;
        isEmpty.value = false;
    }

    //发送评论
    const post = createRequest<PostCommentBody>("post", (statusCode) => {
        return statusCode === 403
            ? "无评论权限"
            : "评论发送失败";
    });

    //修改评论
    const modify = createRequest<PutCommentBody>("put", (statusCode) => {
        return statusCode === 403
            ? "无修改权限"
            : "评论修改失败";
    });

    //删除评论
    const remove = createRequest<DeleteCommentBody>("delete", (statusCode) => {
        return statusCode === 403
            ? "无删除权限"
            : "评论删除失败";
    });

    function createRequest<T extends Record<string, any>>(method: "post" | "put" | "delete", getter: (statusCode: number) => string) {
        return async (body: T) => {
            try {
                const res = await $fetch("/api/comment", {
                    method,
                    body,
                });
                if (res.error) {
                    throw createError({ status: res.error });
                }
                update(1);
            }
            catch (err) {
                const statusCode = isObject(err) ? Reflect.get(err, "statusCode") : void 0;
                const message = typeof statusCode === "number" ? getter(statusCode) : String(err);
                toastStore.error(`[comment]:${method}`, message);
                throw err;
            }
        };
    }

    return {
        comments,
        mainCount,
        totalCount,
        isEmpty,
        clear,
        update,
        post,
        modify,
        remove,
    };
});

//处理评论
function processComments<T extends CommentData>(comments: T[]) {
    return (comments as WithParent<T>[]).map((item) => {
        //子评论回归指向
        (function func(parent) {
            for (const child of parent.children) {
                child.parent = parent;
                func(child);
            }
        })(item);

        //将嵌套子评论拍平
        for (const child of item.children) {
            if (child.children.length) {
                item.children.push(...child.children);
                child.children.length = 0;
            }
        }

        //按时间排序
        item.children.sort((a, b) => a.time.localeCompare(b.time));

        return item;
    });
}
