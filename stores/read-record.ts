export const useReadRecordStore = defineStore("read-record", {
    state: () => ({
        record: {}
    }),
    actions: {
        get(novel: string) {
            return this.record[novel];
        },
        set(novel: string, data: {
            index: string,
            title: string
        }) {
            this.record[novel] = data;
        }
    },
    persist: true
});