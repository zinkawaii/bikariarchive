import { LazyDialogConfirm, LazyDialogNumeric } from "#components";
import type { DialogNumericProps } from "~/components/dialog/numeric.vue";

// 判断对话框
export function requireConfirm(message: string) {
  return new Promise<boolean>((resolve) => {
    const modalStore = useModalStore();

    const { close } = modalStore.use(() => h(LazyDialogConfirm, {
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

// 数字选择框
export function requireNumeric(options: DialogNumericProps) {
  return new Promise<number>((resolve) => {
    const modalStore = useModalStore();

    const { close } = modalStore.use(() => h(LazyDialogNumeric, {
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
