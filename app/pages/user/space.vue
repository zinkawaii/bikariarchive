<script lang="ts" setup>
    import { injectionKey } from "~/types/space";

    const route = useRoute();
    const userStore = useUserStore();

    useHead({
        title: userStore.nickname
    });

    //是否是本人
    const isMyself = computed(() => {
        return userStore.uid === Number(route.params.uid);
    });

    const { data } = useLazyFetch("/api/user/info", {
        query: {
            uid: route.params.uid
        },
        immediate: !isMyself.value
    });

    //用户是否存在
    const isExist = computed(() => {
        return isMyself.value || !data.value.error;
    });

    const uid = computed({
        get() {
            return isMyself.value ? userStore.uid : data.value.uid;
        },
        set(val) {
            isMyself.value && (userStore.uid = val);
        }
    });

    const nickname = computed({
        get() {
            return isMyself.value ? userStore.nickname : data.value.nickname;
        },
        set(val) {
            isMyself.value && (userStore.nickname = val);
        }
    });

    const sign = computed({
        get() {
            return isMyself.value ? userStore.sign : data.value.sign;
        },
        set(val) {
            isMyself.value && (userStore.sign = val);
        }
    });

    provide(injectionKey, {
        isMyself,
        uid,
        nickname,
        sign
    });
</script>

<template>
    <template v-if="isExist">
        <space-banner />
    </template>
    <not-found v-else/>
</template>