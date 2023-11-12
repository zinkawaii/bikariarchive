export const useSearchHistoryStore = defineStore("seach-history", () => {
    const history = ref([]);

    function push(word: string) {
        const pos = history.value.indexOf(word);
        if (pos !== -1) {
            history.value.splice(pos, 1);
        }
        history.value.unshift(word);
    }

    function clear() {
        history.value.length = 0;
    }

    return {
        history,
        push,
        clear
    };
}, {
    persist: true
});