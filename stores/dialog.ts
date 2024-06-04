import type { WatchSource } from "vue";
import type { MaybeComputedElementRef } from "@vueuse/core";

interface UseDialogOptions {
    isOpened: WatchSource<boolean>;
    onClose: () => any;
}

interface DialogInfo {
    zIndex: number;
    onClose: () => any;
}

export const useDialogStore = defineStore("dialog", {
    state: () => ({
        dialogs: [] as DialogInfo[]
    })
});

export function useDialog(el: MaybeComputedElementRef, options: UseDialogOptions) {
    const dialogStore = useDialogStore();
    const { dialogs } = storeToRefs(dialogStore);
    const { isOpened, onClose } = options;

    whenever(isOpened, async () => {
        await nextTick();
        const target = unrefElement(el);
        const last = dialogs.value.at(-1);
        const zIndex = (last?.zIndex ?? 510) + 2;
        target.style.zIndex = String(zIndex);

        const info = {
            zIndex,
            onClose
        };

        dialogs.value.push(info);
        await until(isOpened).toBe(false);
        const i = dialogs.value.indexOf(info);
        dialogs.value.splice(i, 1);
    });
}