import { LazyMbConfirm, LazyMbNumeric } from "#components";
import type { MbNumericProps } from "~/components/shared/numeric.vue";

//判断对话框
export function requireConfirm(message: string) {
    return new Promise<boolean>((resolve) => {
        const modalStore = useModalStore();

        const { close } = modalStore.use(() => h(LazyMbConfirm, {
            message,
            onClose(val = false) {
                close();
                resolve(val);
            },
        }), {
            immediate: true,
        });
    });
}

//数字选择框
export function requireNumeric(options: MbNumericProps) {
    return new Promise<number>((resolve) => {
        const modalStore = useModalStore();

        const { close } = modalStore.use(() => h(LazyMbNumeric, {
            ...options,
            onClose(val = options.initialValue) {
                close();
                resolve(val ?? 0);
            },
        }), {
            immediate: true,
        });
    });
}
