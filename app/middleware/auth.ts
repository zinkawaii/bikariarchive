export default defineNuxtRouteMiddleware(async (to) => {
    const toastStore = useToastStore();
    const signerStore = useSignerStore();
    const userStore = useUserStore();

    //等待登录信息获取
    await userStore.getInfo;

    //权限验证
    if (!userStore.isLogin) {
        signerStore.open();
        return false;
    }
    else if (userStore.identity < to.meta.identity) {
        toastStore.error("[identity]", "无访问权限");
        return false;
    }
});