export const useMaskStore = defineStore("mask", {
    state: () => ({
        isOpened: null,
        duration: 0,
        onClick: null
    })
});

export function useMask({
    isOpened = null,
    duration = 400,
    onClick = null
} = {}) {
    const maskStore = useMaskStore();
    whenever(isOpened, () => {
        maskStore.isOpened = computed(isOpened);
        maskStore.duration = duration;
        maskStore.onClick = onClick;
    });
}