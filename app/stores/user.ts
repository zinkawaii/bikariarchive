export const useUserStore = defineStore("user", () => {
    const uid = ref(-1);
    const nickname = ref("");
    const identity = ref(0);
    const sign = ref("");

    const isLogin = computed(() => {
        return uid.value !== -1;
    });

    //获取登陆信息
    const getInfo = useFetch("/api/user/info");

    getInfo.then(({ data }) => {
        const info = data.value;

        if (!info.error) {
            uid.value = info.uid;
            nickname.value = info.nickname;
            identity.value = info.identity;
            sign.value = info.sign;
        }
    });

    function reset() {
        uid.value = -1;
        nickname.value = "";
        identity.value = 0;
        sign.value = "";
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