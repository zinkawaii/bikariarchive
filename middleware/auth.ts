export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();

    //等待登录信息获取
    await userStore.getInfo;

    //权限验证
    if (!userStore.isLogin || userStore.identity < (to.meta.identity as number)) {
        return navigateTo({
            name: "login"
        });
    }
});