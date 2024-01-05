export const useCommentPanelStore = defineStore("comment-panel", {
    state: () => ({
        isOpened: false,
        nickname: "",
        email: "",
        address: "",
        replyId: "",
        onReply: null
    }),
    actions: {
        open({
            replyId = "",
            onReply = null
        }) {
            this.isOpened = true;
            this.replyId = replyId;
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