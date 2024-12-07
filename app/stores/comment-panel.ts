import { LazyCommentPanel } from "#components";
import type { CommentKind, CommentModifyOptions, CommentReplyOptions } from "~/types/comment";

export const useCommentPanelStore = defineStore("comment-panel", () => {
    const kind = ref<CommentKind>();
    const content = ref("");
    const nickname = ref("");
    const email = ref("");
    const address = ref("");
    const path = ref("");
    const replyOptions = ref<CommentReplyOptions>();
    const modifyOptions = ref<CommentModifyOptions>();

    const route = useRoute();
    const dialogStore = useDialogStore();
    const userStore = useUserStore();

    const mode = computed(() => {
        return userStore.isLogin ? "user" : "guest";
    });

    const { open, close } = dialogStore.use(() => h(LazyCommentPanel), {
        unique: true
    });

    function post() {
        kind.value = "post";
        path.value = route.path;
        open();
    }

    function reply(options: CommentReplyOptions) {
        kind.value = "reply";
        path.value = route.path;
        replyOptions.value = options;
        open();
    }

    function modify(options: CommentModifyOptions) {
        kind.value = "modify";
        modifyOptions.value = options;
        open();
    }

    return {
        kind,
        content,
        mode,
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
        pick: [
            "nickname",
            "email",
            "address"
        ],
        storage: piniaPluginPersistedstate.localStorage()
    }
});