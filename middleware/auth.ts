export default defineNuxtRouteMiddleware(async (to, from) => {
    const messageStore = useMessageStore();
    const signerStore = useSignerStore();
    const userStore = useUserStore();

    //等待登录信息获取
    await userStore.getInfo;

    //权限验证
    if (!userStore.isLogin) {
        signerStore.open();
        return false;
    }
    else if (userStore.identity < (to.meta.identity as number)) {
        messageStore.show("identity-error", "无访问权限 (Limit Code: 143)");
        return false;
    }
});