import { CommentPanel } from "#components";
import type { CommentMode, CommentModifyOptions, CommentReplyOptions } from "~/types/comment";

export const useCommentPanelStore = defineStore("comment-panel", () => {
    const mode = ref<CommentMode>();
    const content = ref("");
    const nickname = ref("");
    const email = ref("");
    const address = ref("");
    const path = ref("");
    const replyOptions = ref<CommentReplyOptions>();
    const modifyOptions = ref<CommentModifyOptions>();

    const dialogStore = useDialogStore();

    const { open, close } = dialogStore.use(() => h(CommentPanel), {
        unique: true
    });

    function post() {
        mode.value = "post";
        path.value = location.pathname;
        open();
    }

    function reply(options: CommentReplyOptions) {
        mode.value = "reply";
        path.value = location.pathname;
        replyOptions.value = options;
        open();
    }

    function modify(options: CommentModifyOptions) {
        mode.value = "modify";
        modifyOptions.value = options;
        open();
    }

    return {
        mode,
        content,
        nickname,
        email,
        address,
        path,
        replyOptions,
        modifyOptions,
        close,
        post,
        reply,
        modify
    };
}, {
    persist: {
        paths: [
            "nickname",
            "email",
            "address"
        ]
    }
});