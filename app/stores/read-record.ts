import type { ReadRecord } from "~/types/read-record";

export const useReadRecordStore = defineStore("read-record", () => {
  const record = ref<Record<string, ReadRecord>>({});

  function get(novel: string) {
    return record.value[novel];
  }

  function set(novel: string, data: ReadRecord) {
    record.value[novel] = data;
  }

  return {
    record,
    get,
    set,
  };
}, {
  persist: {
    pick: ["record"],
  },
});
