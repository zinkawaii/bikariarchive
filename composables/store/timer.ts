export const useTimerStore = defineStore("timer", () => {
    const now = ref(new Date());

    Zin.setInterval(() => {
        now.value = new Date();
    }, {
        duration: 1000
    });

    return {
        now
    };
});