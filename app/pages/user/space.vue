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

    //不是本人
    const isNotMyself = computed(() => !isMyself.value);

    //获取用户信息
    const { data } = useLazyFetch("/api/user/info", {
        query: {
            uid: route.params.uid
        },
        immediate: isNotMyself.value
    });

    //用户是否存在
    const isExist = computed(() => {
        return isMyself.value || !data.value.error;
    });

    const { uid, nickname, sign } = useSourceRefs(() => (isMyself.value ? userStore : data.value), {
        uid: {
            readonly: isNotMyself
        },
        nickname: {
            readonly: isNotMyself
        },
        sign: {
            readonly: isNotMyself
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