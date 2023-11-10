<script setup>
    useHead({
        title: "404"
    });

    const router = useRouter();
    const time = ref(4);

    onUnmounted(() => {
        controller.abort();
    });

    const controller = new TimeoutController();
    Zin.setInterval(() => {
        time.value--;
    }, {
        duration: 1000,
        times: 4,
        controller
    })
    .then(() => {
        router.replace("/home");
    });
</script>

<template>
    <div class="content-group">
        <p class="text-center">你访问了一个不存在的页面！将在 {{ time }} 秒后<nuxt-link to="/home">返回主页</nuxt-link>。</p>
    </div>
</template>