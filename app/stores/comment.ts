import { LazyCommentPanel } from "#components";
import type { DeleteCommentBody } from "#server/api/comment.delete";
import type { PatchCommentBody } from "#server/api/comment.patch";
import type { PostCommentBody } from "#server/api/comment.post";
import type { PutCommentBody } from "#server/api/comment.put";
import type { CommentData } from "#server/types/comment";

export const useCommentStore = defineStore("comment", () => {
  const comments = shallowRef<WithParent<CommentData>[]>();
  const mainCount = ref(0);
  const totalCount = ref(0);
  const isEmpty = ref(false);
  const page = ref(1);

  const content = ref("");
  const nickname = ref("");
  const email = ref("");
  const address = ref("");

  const route = useRoute();
  const modalStore = useModalStore();
  const toastStore = useToastStore();

  // 切换页数时立即更新
  const handle = watch(page, update);

  // 清空评论
  function clear() {
    // 暂停更新
    handle.pause();

    comments.value = [];
    mainCount.value = 0;
    totalCount.value = 0;
    isEmpty.value = true;
    page.value = 1;
  }

  // 更新评论
  async function update(next?: number) {
    // 恢复更新
    handle.resume();

    const res = await $fetch("/api/comment", {
      query: {
        path: route.path,
        page: next ?? page.value,
      },
    });

    comments.value = processComments(res.list);
    mainCount.value = res.mainCount;
    totalCount.value = res.totalCount;
    isEmpty.value = false;

    if (next !== void 0) {
      page.value = next;
    }
  }

  // 发送评论
  const post = createRequest<PostCommentBody>("post", (status) => {
    return status === 403
      ? "无评论权限"
      : "评论发送失败";
  });

  const audit = createRequest<PatchCommentBody>("patch", (status) => {
    return status === 403
      ? "无审核权限"
      : "评论审核失败";
  });

  // 修改评论
  const modify = createRequest<PutCommentBody>("put", (status) => {
    return status === 403
      ? "无修改权限"
      : "评论修改失败";
  });

  // 删除评论
  const remove = createRequest<DeleteCommentBody>("delete", (status) => {
    return status === 403
      ? "无删除权限"
      : "评论删除失败";
  });

  function createRequest<T extends Record<string, any>>(
    method: "post" | "patch" | "put" | "delete",
    getter: (status: number) => string,
  ) {
    return async (body: T) => {
      try {
        await $fetch("/api/comment", {
          method,
          body,
        });
        update();
      }
      catch (err: any) {
        const message = typeof err?.status === "number" ? getter(err.status) : String(err);
        toastStore.error(`[comment]:${method}`, message);
        throw err;
      }
    };
  }

  function requirePost(parent?: CommentData) {
    modalStore.use(() => h(LazyCommentPanel, {
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

  async function requireAudit(id: string) {
    if (await requireConfirm("是否将此评论设置为公开状态？")) {
      await audit({ id });
    }
  }

  function requireModify(data: CommentData) {
    modalStore.use(() => h(LazyCommentPanel, {
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
    page,
    nickname,
    email,
    address,
    clear,
    update,
    post,
    audit,
    modify,
    remove,
    requirePost,
    requireAudit,
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

// 处理评论
function processComments<T extends CommentData>(comments: WithParent<T>[]) {
  return comments.map((item) => {
    // 子评论回归指向
    function assign(parent: WithParent<T>) {
      for (const child of parent.children) {
        child.parent = parent;
        assign(child);
      }
    }
    assign(item);

    // 将嵌套子评论拍平
    for (const child of item.children) {
      if (child.children.length) {
        item.children.push(...child.children);
        child.children.length = 0;
      }
    }

    // 按时间排序
    item.children.sort((a, b) => a.time.localeCompare(b.time));

    return item;
  });
}
