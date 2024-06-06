import type { CommentMode, CommentModifyOptions, CommentReplyOptions } from "~/types/comment";

export const useCommentPanelStore = defineStore("comment-panel", {
    state: () => ({
        isOpened: false,
        mode: "" as CommentMode,
        content: "",
        nickname: "",
        email: "",
        address: "",
        path: "",
        replyOptions: {} as CommentReplyOptions,
        modifyOptions: {} as CommentModifyOptions
    }),
    actions: {
        post() {
            this.open("post");
            this.path = location.pathname;
        },
        reply(options: CommentReplyOptions) {
            this.open("reply");
            this.path = location.pathname;
            this.replyOptions = options;
        },
        modify(options: CommentModifyOptions) {
            this.open("modify");
            this.modifyOptions = options;
        },
        open(mode: CommentMode) {
            this.isOpened = true;
            this.mode = mode;
        },
        close() {
            this.isOpened = false;
        }
    },
    persist: {
        paths: [
            "nickname",
            "email",
            "address"
        ]
    }
});