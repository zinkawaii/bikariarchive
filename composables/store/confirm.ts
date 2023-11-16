export const useConfirmStore = defineStore("confirm", () => {
    const content = ref("");
    const isShow = ref(false);

    let res = null;

    function show(str: string) {
        content.value = str;
        isShow.value = true;
        return new Promise((resolve) => {
            res = resolve;
        });
    }

    function hide(state: boolean) {
        isShow.value = false;
        res(state);
    }

    return {
        content,
        isShow,
        show,
        hide
    }
});