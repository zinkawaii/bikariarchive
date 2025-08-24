import { LazyZSigner } from "#components";
import type { SignerView } from "~/types/signer";

export const useSignerStore = defineStore("signer", () => {
    const currentView = ref<SignerView>("login");

    const dialogStore = useDialogStore();

    //挂载弹窗实例
    const { open, close } = dialogStore.use(() => h(LazyZSigner), {
        unique: true,
    });

    //切换当前视图
    function switchView(view: SignerView) {
        currentView.value = view;
    }

    return {
        currentView,
        open,
        close,
        switchView,
    };
});
