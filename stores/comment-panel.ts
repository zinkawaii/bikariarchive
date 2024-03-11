export const useCommentPanelStore = defineStore("comment-panel", {
    state: () => ({
        isOpened: false,
        nickname: "",
        email: "",
        address: "",
        path: "",
        replyId: "",
        replyName: "",
        onReply: null
    }),
    actions: {
        open({
            replyId = "",
            replyName = "",
            onReply = null
        }) {
            this.isOpened = true;
            this.path = location.pathname;
            this.replyId = replyId;
            this.replyName = replyName;
            this.onReply = onReply;
        },
        close(success = false) {
            this.isOpened = false;
            if (success && this.onReply) {
                this.onReply();
            }
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