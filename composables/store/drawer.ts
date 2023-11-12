export const useDrawerStore = defineStore("drawer", {
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