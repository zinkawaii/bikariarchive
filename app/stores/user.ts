export const useUserStore = defineStore("user", () => {
    const uid = ref(-1);
    const nickname = ref("");
    const avatar = ref("");
    const identity = ref(0);
    const sign = ref("");

    const isLoggedIn = computed(() => {
        return uid.value !== -1;
    });

    //获取登陆信息
    const promise = useFetch("/api/user/info").then(({ data }) => {
        if (data.value) {
            uid.value = data.value.uid;
            nickname.value = data.value.nickname;
            avatar.value = data.value.avatar;
            identity.value = data.value.identity;
            sign.value = data.value.sign;
        }
    });

    function reset() {
        uid.value = -1;
        nickname.value = "";
        avatar.value = "";
        identity.value = 0;
        sign.value = "";
    }

    return {
        uid,
        nickname,
        avatar,
        identity,
        sign,
        isLoggedIn,
        promise,
        reset,
    };
});
