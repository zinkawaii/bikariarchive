export type SignerCurrentView = "login" | "logon" | "profile";

export const useSignerStore = defineStore("signer", {
    state: () => ({
        isOpened: false,
        currentView: ""
    }),
    actions: {
        open() {
            this.isOpened = true;
        },
        close() {
            this.isOpened = false;
        },
        switchView(view: SignerCurrentView) {
            this.currentView = view;
        }
    }
});