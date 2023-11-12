<script setup>
    useHead({
        title: "404"
    });

    const router = useRouter();
    const time = ref(4);

    const controller = new TimeoutController();
    Zin.setInterval(() => {
        time.value--;
    }, {
        duration: 1000,
        times: 4,
        controller
    })
    .then(() => {
        router.replace({ name: "home" });
    });

    onUnmounted(() => {
        controller.abort();
    });
</script>

<template>
    <div class="content-group">
        <p class="text-center">你访问了一个不存在的页面！将在 {{ time }} 秒后<nuxt-link :to="{ name: `home` }">返回主页</nuxt-link>。</p>
    </div>
</template>