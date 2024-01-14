export const useMaskStore = defineStore("mask", {
    state: () => ({
        isOpened: null,
        duration: 0,
        onclick: null
    })
});

export function useMask({
    isOpened = null,
    duration = 400,
    onclick = null
} = {}) {
    const maskStore = useMaskStore();
    whenever(isOpened, () => {
        maskStore.isOpened = computed(isOpened);
        maskStore.duration = duration;
        maskStore.onclick = onclick;
    });
}