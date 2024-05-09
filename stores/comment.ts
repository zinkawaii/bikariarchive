import type { CommentData, DeleteCommentBody, PostCommentBody } from "~/server/types/api/comment";
import type { WithParent } from "~/types";

export const useCommentStore = defineStore("comment", () => {
    const data = ref<WithParent<CommentData>[]>();
    const mainCount = ref(0);
    const totalCount = ref(0);

    const route = useRoute();
    const toastStore = useToastStore();

    //更新评论
    async function update(page: number) {
        const { error, mainCount: main, totalCount: total, data: res } = await $fetch("/api/comment", {
            query: {
                path: route.path,
                page: page
            }
        });
        if (error !== 0) return;

        mainCount.value = main;
        totalCount.value = total;
        data.value = processComments(res);
    }

    //发送评论
    async function send(body: PostCommentBody) {
        try {
            await $fetch("/api/comment", {
                method: "post",
                body
            });
            update(1);
        }
        catch (err) {
            toastStore.error("comment-error", "评论发送失败");
            throw err;
        }
    }

    //删除评论
    async function remove(body: DeleteCommentBody) {
        try {
            await $fetch("/api/comment", {
                method: "delete",
                body
            });
            update(1);
        }
        catch (err) {
            toastStore.error("comment-delete-error", "评论删除失败");
            throw err;
        }
    }

    return {
        data,
        mainCount,
        totalCount,
        update,
        send,
        remove
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
            if (child.children.length > 0) {
                item.children.push(...child.children);
                child.children.length = 0;
            }
        }

        //按时间排序
        item.children.sort((a, b) => a.time.localeCompare(b.time));

        return item;
    });
}