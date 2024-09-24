<script lang="ts" setup>
    useHead({
        title: "404"
    });

    const router = useRouter();
    const time = ref(3);

    Zin.interval(() => {
        time.value--;
    }, {
        immediate: false,
        duration: 1000,
        times: time.value
    })
    .then(() => {
        router.replace({ name: "home" });
    });
</script>

<template>
    <meow-widget>
        <p class="text-center">你访问了一个不存在的页面！将在 {{ time }} 秒后<plain-link :to="{ name: `home` }">返回主页</plain-link>。</p>
    </meow-widget>
</template>