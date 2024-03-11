export const useUserStore = defineStore("user", () => {
    const uid = ref(-1);
    const nickname = ref("");
    const identity = ref(0);
    const sign = ref("");
    const isLogin = ref(false);

    //获取登陆信息
    const getInfo = useFetch("/api/user/info");

    getInfo.then(({ data }) => {
        const info: any = data.value;

        if (info.isLogin) {
            uid.value = info.uid;
            nickname.value = info.nickname;
            identity.value = info.identity;
            sign.value = info.sign;
            isLogin.value = true;
        }
    });

    function reset() {
        uid.value = -1;
        nickname.value = "";
        identity.value = 0;
        sign.value = "";
        isLogin.value = false;
    }

    return {
        uid,
        nickname,
        identity,
        sign,
        isLogin,
        getInfo,
        reset
    };
});