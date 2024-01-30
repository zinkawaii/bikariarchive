<script setup>
    const props = defineProps({
        name: String
    });

    const messageStore = useMessageStore();

    onMounted(async () => {
        await Zin.setTimeout(5000);
        remove();
    });

    function remove() {
        messageStore.remove(props.name);
    }
</script>

<template>
    <div class="message-item" @click="remove">
        <span class="message-content"><slot></slot></span>
        <div class="message-progress"></div>
    </div>
</template>

<style lang="scss" scoped>
    .message-item {
        overflow: hidden;
        margin-bottom: 16px;
        padding-top: 2px;
        border: 1px solid var(--color-border-light);
        border-radius: var(--circle-radius);
        box-shadow: var(--box-shadow-dark);
        background-color: var(--color-background);
        cursor: pointer;
        pointer-events: auto;
    }

    .message-content {
        padding-inline: 18px;
        font-size: 14px;
        line-height: 32px;
    }

    .message-progress {
        height: 2px;
        background-color: var(--color-theme);
        transform-origin: left;
        animation: progress linear 5s;
    }

    @keyframes progress {
        from {
            scale: 0 1;
        }

        to {
            scale: 1;
        }
    }
</style>