import type { Raw, RenderFunction, VNodeChild } from "vue";

interface DialogInfo {
    component: VNodeChild;
    zIndex: number;
    duration: number;
    opening: Ref<boolean>;
    close: () => any;
}

interface UseDialogOptions {
    duration?: number;
    unique?: boolean;
}

export const useDialogStore = defineStore("dialog", () => {
    const dialogs = ref<Raw<DialogInfo>[]>([]);

    function use(render: RenderFunction, options: UseDialogOptions = {}) {
        const {
            duration = 400,
            unique = false
        } = options;

        let info: DialogInfo = null;
        const opening = ref(false);

        function open() {
            if (unique && indexOf() !== -1) return;

            const last = dialogs.value.at(-1);
            const zIndex = (last?.zIndex ?? 510) + 2;

            info = {
                component: render(),
                zIndex,
                duration,
                opening,
                close
            };

            dialogs.value.push(info);
            nextTick(() => {
                opening.value = true;
            });
        }

        async function close() {
            info.opening.value = false;
            await Zin.delay(duration);

            const i = indexOf();
            if (i !== -1) {
                dialogs.value.splice(i, 1);
            }
        }

        function indexOf() {
            return dialogs.value.indexOf(info);
        }

        return {
            open,
            close
        };
    }

    return {
        dialogs,
        use
    };
});