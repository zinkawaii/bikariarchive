export const useSignerStore = defineStore("signer", {
    state: () => ({
        state: false
    }),
    actions: {
        open() {
            this.state = true;
        },
        close() {
            this.state = false;
        },
        toggle(state: boolean) {
            this.state = state ?? !this.state;
        }
    }
});