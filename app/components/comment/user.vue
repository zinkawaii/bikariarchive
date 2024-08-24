<script lang="ts" setup>
    defineProps<{
        avatar: string;
        nickname: string;
        address: string;
    }>();
    defineEmits<{
        close: [];
    }>();
</script>

<template>
    <mb-dialog class="comment-user" @close="$emit(`close`)">
        <user-avatar :src="avatar"/>
        <span class="content-h2">{{ nickname }}</span>
        <plain-link v-if="address" :to="address">{{ address }}</plain-link>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .comment-user {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 24px;
        font-size: 14px;
        text-align: center;
    }

    .user-avatar {
        width: 72px;
    }
</style>