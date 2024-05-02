import type { WatchSource } from "vue";

interface MaskInfo {
    onClick: () => any;
}

export const useMaskStore = defineStore("mask", {
    state: () => ({
        list: [] as MaskInfo[]
    })
});

export function useMask(options: MaskInfo & {
    isOpened: WatchSource<boolean>;
}) {
    const maskStore = useMaskStore();
    const { isOpened } = options;

    whenever(isOpened, async () => {
        const info: MaskInfo = {
            onClick: options.onClick
        };

        maskStore.list.push(info);
        await until(isOpened).toBe(false);
        const i = maskStore.list.indexOf(info);
        maskStore.list.splice(i, 1);
    });
}