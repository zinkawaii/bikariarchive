import { LazyZSigner } from "#components";

export const useSignerStore = defineStore("signer", () => {
  const modalStore = useModalStore();

  const { user, fetch: refresh, clear } = useUserSession();

  const isAdmin = computed(() => {
    return user.value?.role === "admin";
  });

  // 挂载弹窗实例
  const { open, close } = modalStore.use(() => h(LazyZSigner), {
    unique: true,
  });

  return {
    isAdmin,
    refresh,
    clear,
    open,
    close,
  };
});
