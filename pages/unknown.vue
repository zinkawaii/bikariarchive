<script setup>
    useHead({
        title: "404"
    });

    const router = useRouter();
    const time = ref(4);

    Zin.setInterval(() => {
        time.value--;
    }, {
        duration: 1000,
        times: 4
    })
    .then(() => {
        router.replace({ name: "home" });
    });
</script>

<template>
    <div class="content-widget" z-main>
        <p class="text-center">你访问了一个不存在的页面！将在 {{ time }} 秒后<coco-link :to="{ name: `home` }">返回主页</coco-link>。</p>
    </div>
</template>