<script setup>
    const interval = 30;
    let last = 0;
    let now = performance.now();
    let count = 0;

    const displayValue = ref(60);

    onMounted(function render() {
        count++;
        if (count >= interval) {
            last = now;
            now = performance.now();
            displayValue.value = Math.round(1000 * count / (now - last));
            count = 0;
        }
        window.requestAnimationFrame(render);
    });
</script>

<template>
    <span class="mb-fps">{{ displayValue }}FPS</span>
</template>

<style lang="scss" scoped>
    .mb-fps {
        position: fixed;
        top: 0;
        left: 2px;
        background: linear-gradient(120deg, rgb(240 144 255), rgb(240 88 104));
        background-clip: text;
        font-size: 12px;
        font-weight: bold;
        color: transparent;
    }
</style>