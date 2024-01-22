<script setup>
    const messageStore = useMessageStore();

    const messageList = computed(() => {
        const res = [];
        for (const item of messageStore.map) {
            res.unshift(item);
        }
        return res;
    });
</script>

<template>
    <div class="message-area">
        <transition-group name="msg">
            <message-item v-for="[key, content] in messageList" :key="key" :name="key">{{ content }}</message-item>
        </transition-group>
    </div>
</template>

<style lang="scss" scoped>
    .message-area {
        display: grid;
        justify-items: center;
        position: fixed;
        top: 80px;
        pointer-events: none;
        inset-inline: 0;
    }

    .msg-enter-active, .msg-leave-active {
        transform-origin: top;
        transition: all 0.4s;
    }

    .msg-enter-from, .msg-leave-to {
        opacity: 0;
        margin-bottom: -38px;
        scale: 0;
    }
</style>