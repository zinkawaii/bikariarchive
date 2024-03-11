export const useMessageStore = defineStore("message", {
    state: () => ({
        map: new Map()
    }),
    actions: {
        show(key: string, message: string) {
            const hash = Math.random().toString(36);
            for (const item of this.map) {
                if (item[0].startsWith(key)) {
                    this.remove(item[0]);
                    break;
                }
            }
            this.map.set(key + hash, message);
        },
        remove(key: string) {
            this.map.delete(key);
        }
    }
});