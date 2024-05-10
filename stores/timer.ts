export const useTimerStore = defineStore("timer", () => {
    const now = ref(new Date());

    Zin.interval(() => {
        now.value = new Date();
    }, {
        duration: 1000
    });

    return {
        now
    };
});