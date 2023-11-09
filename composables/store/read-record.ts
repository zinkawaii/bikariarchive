export const useReadRecordStore = defineStore("read-record", () => {
    const record = ref({});

    function get(novel: string) {
        return record.value[novel];
    }

    function set(novel: string, data: {
        index: string,
        title: string
    }) {
        record.value[novel] = data;
    }

    return {
        record,
        get,
        set
    };
}, {
    persist: true
});