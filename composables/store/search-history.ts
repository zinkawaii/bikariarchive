export const useSearchHistoryStore = defineStore("seach-history", {
    state: () => ({
        history: []
    }),
    actions: {
        push(word: string) {
            const pos = this.history.indexOf(word);
            if (pos !== -1) {
                this.history.splice(pos, 1);
            }
            this.history.unshift(word);
        },
        clear() {
            this.history.length = 0;
        }
    },
    persist: true
});