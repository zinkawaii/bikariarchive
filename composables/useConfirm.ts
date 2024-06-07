import { MbConfirm } from "#components";

export function useConfirm(message: string) {
    return new Promise((resolve) => {
        const dialogStore = useDialogStore();

        const { close } = dialogStore.use(() => h(MbConfirm, {
            message,
            onCancel: cancel,
            onConfirm: confirm
        }), {
            immediate: true
        });

        function cancel() {
            close();
            resolve(false);
        }

        function confirm() {
            close();
            resolve(true);
        }
    });
}