<script lang="ts" setup>
    import { injectionKey } from "~/types/space";

    const userStore = useUserStore();
    const route = useRoute();

    useHead({
        title: userStore.nickname,
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
            uid: route.params.uid,
        },
        immediate: isNotMyself.value,
    });

    //用户是否存在
    const isExist = computed(() => {
        return isMyself.value || !data.value?.error;
    });

    const { uid, nickname, sign, avatar } = useSourceRefs(() => (isMyself.value ? userStore : data.value!), {
        uid: {
            readonly: isNotMyself,
        },
        nickname: {
            readonly: isNotMyself,
        },
        sign: {
            readonly: isNotMyself,
        },
        avatar: {
            readonly: isNotMyself,
        },
    });

    provide(injectionKey, {
        isMyself,
        uid,
        nickname,
        sign,
        avatar,
    });
</script>

<template>
    <template v-if="isExist">
        <space-banner />
        <div class="space-complex">
            <home-blank />
            <space-password />
        </div>
    </template>
    <not-found v-else/>
</template>

<style lang="scss" scoped>
    .space-complex {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 16px;

        @include viewport("sm") {
            grid-template-columns: 1fr;
        }
    }
</style>
