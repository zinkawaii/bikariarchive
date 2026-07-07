export default defineNuxtRouteMiddleware(async (to) => {
  const signerStore = useSignerStore();
  const toastStore = useToastStore();
  const userStore = useUserStore();

  // 等待登录信息获取
  await userStore.promise;

  // 权限验证
  if (!userStore.isLoggedIn) {
    signerStore.open();
    return false;
  }
  else if (userStore.identity < (to.meta.identity ?? 0)) {
    toastStore.error("[identity]", "无访问权限");
    return false;
  }
});
