import { LazyCommentPanel } from "#components";
import type { CommentData, DeleteCommentBody, PostCommentBody, PutCommentBody } from "~~/server/types/api/comment";

export const useCommentStore = defineStore("comment", () => {
    const comments = shallowRef<WithParent<CommentData>[]>();
    const mainCount = ref(0);
    const totalCount = ref(0);
    const isEmpty = ref(false);

    const content = ref("");
    const nickname = ref("");
    const email = ref("");
    const address = ref("");

    const route = useRoute();
    const dialogStore = useDialogStore();
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
                page,
            },
        });

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

    function createRequest<T extends Record<string, any>>(
        method: "post" | "put" | "delete",
        getter: (statusCode: number) => string,
    ) {
        return async (body: T) => {
            try {
                await $fetch("/api/comment", {
                    method,
                    body,
                });
                update(1);
            }
            catch (err: any) {
                const message = typeof err?.statusCode === "number" ? getter(err.statusCode) : String(err);
                toastStore.error(`[comment]:${method}`, message);
                throw err;
            }
        };
    }

    function requirePost(parent?: CommentData) {
        dialogStore.use(() => h(LazyCommentPanel, {
            kind: "post",
            parent,
            path: route.path,
            content: content.value,
            nickname: nickname.value,
            email: email.value,
            address: address.value,
            "onUpdate:content": (val) => (content.value = val),
            "onUpdate:nickname": (val) => (nickname.value = val),
            "onUpdate:email": (val) => (email.value = val),
            "onUpdate:address": (val) => (address.value = val),
        }), {
            immediate: true,
        });
    }

    function requireModify(data: CommentData) {
        dialogStore.use(() => h(LazyCommentPanel, {
            kind: "modify",
            ...data,
        }), {
            immediate: true,
        });
    }

    return {
        comments,
        mainCount,
        totalCount,
        isEmpty,
        nickname,
        email,
        address,
        clear,
        update,
        post,
        modify,
        remove,
        requirePost,
        requireModify,
    };
}, {
    persist: {
        pick: [
            "nickname",
            "email",
            "address",
        ],
        storage: piniaPluginPersistedstate.localStorage(),
    },
});

//处理评论
function processComments<T extends CommentData>(comments: WithParent<T>[]) {
    return comments.map((item) => {
        //子评论回归指向
        function assign(parent: WithParent<T>) {
            for (const child of parent.children) {
                child.parent = parent;
                assign(child);
            }
        }
        assign(item);

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
