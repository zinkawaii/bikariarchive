import type { Raw, RenderFunction, VNodeChild } from "vue";

interface DialogContext {
    component: VNodeChild;
    zIndex: number;
    duration: number;
    opening: Ref<boolean>;
    close: () => any;
}

interface UseDialogOptions {
    duration?: number;
    immediate?: boolean;
    unique?: boolean;
}

export const useDialogStore = defineStore("dialog", () => {
    const dialogs = ref<Raw<DialogContext>[]>([]);

    function use(render: RenderFunction, options: UseDialogOptions = {}) {
        const {
            duration = 400,
            immediate = false,
            unique = false
        } = options;

        let ctx: DialogContext = null;

        /**
         * 弹窗是否处于显示状态
         * 此变量用于在弹窗上下文被插入列表时单独地触发各自的 transition 动画，而不是由 transition-group 统一处理
         */
        const opening = ref(false);

        //立即打开
        immediate && open();

        function open() {
            if (unique && indexOf() !== -1) return;

            const last = dialogs.value.at(-1);
            const zIndex = (last?.zIndex ?? 510) + 2;

            ctx = {
                component: render(),
                zIndex,
                duration,
                opening,
                close
            };

            dialogs.value.push(ctx);
            nextTick(() => {
                opening.value = true;
            });
        }

        async function close() {
            ctx.opening.value = false;
            await Zin.delay(duration);

            const i = indexOf();
            if (i !== -1) {
                dialogs.value.splice(i, 1);
            }
        }

        function indexOf() {
            return dialogs.value.indexOf(ctx);
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