export const useSignerStore = defineStore("signer", {
    state: () => ({
        isOpened: false
    }),
    actions: {
        open() {
            this.isOpened = true;
        },
        close() {
            this.isOpened = false;
        },
        toggle(state?: boolean) {
            this.isOpened = state ?? !this.isOpened;
        }
    }
});