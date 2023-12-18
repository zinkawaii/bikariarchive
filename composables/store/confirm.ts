export const useConfirmStore = defineStore("confirm", {
    state: () => ({
        content: "",
        isOpened: false,
        res: null
    }),
    actions: {
        show(str: string) {
            this.content = str;
            this.isOpened = true;
            return new Promise((resolve) => {
                this.res = resolve;
            });
        },
        hide(state: boolean) {
            this.isOpened = false;
            this.res(state);
        }
    }
});