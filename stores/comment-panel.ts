export const useCommentPanelStore = defineStore("comment-panel", {
    state: () => ({
        isOpened: false,
        nickname: "",
        email: "",
        address: "",
        path: "",
        replyId: "",
        replyName: ""
    }),
    actions: {
        open({
            replyId = "",
            replyName = ""
        } = {}) {
            this.isOpened = true;
            this.path = location.pathname;
            this.replyId = replyId;
            this.replyName = replyName;
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