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
        <nuxt-img
            class="user-avatar"
            :src="avatar"
            placeholder="/garden/icon/default.png"
        />
        <span class="content-h2">{{ nickname }}</span>
        <plain-link class="user-link" :to="address" target="_blank">
            <span>{{ address }}</span>
            <icon name="ooui:link-external-ltr"/>
        </plain-link>
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
        aspect-ratio: 1;
        border-radius: 100%;
        box-shadow: var(--box-shadow);
    }

    .user-link {
        display: flex;
        align-items: center;
        gap: 4px;
    }
</style>