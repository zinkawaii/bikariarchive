export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();

    //等待登录信息获取
    await userStore.getInfo;

    //权限验证
    if (!userStore.isLogin) {
        return navigateTo({
            name: "login"
        });
    }
    else if (userStore.identity < (to.meta.identity as number)) {
        const confirmStore = useConfirmStore();
        confirmStore.show(`无访问权限 (Limit Code: 143)`);
        return false;
    }
});