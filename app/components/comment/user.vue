<script lang="ts" setup>
    const props = defineProps<{
        avatar: string;
        nickname: string;
        address: string;
        character: string;
    }>();
    defineEmits<{
        close: [];
    }>();

    const displayAddress = computed(() => {
        return props.address
            .replace(/^https?:\/\//, "")
            .replace(/\/$/, "");
    });
</script>

<template>
    <mb-dialog class="comment-user" @close="$emit(`close`)">
        <div class="user-main">
            <user-avatar :src="avatar"/>
            <span class="content-h2">{{ nickname }}</span>
            <ul class="user-tags">
                <li class="user-tag">
                    <iconify name="fa6-solid:user"/>
                    <span>{{ character }}</span>
                </li>
            </ul>
        </div>
        <div v-if="address" class="user-address">
            <plain-link :to="address" hide-external>
                <iconify name="fa6-solid:link"/>
                <span>{{ displayAddress }}</span>
            </plain-link>
        </div>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .comment-user {
        --dialog-padding: 0;

        font-size: 14px;
        text-align: center;
    }

    .user-main {
        display: grid;
        justify-items: center;
        gap: 8px;
        padding: 24px;
    }

    .user-avatar {
        width: 72px;
    }

    .user-tags {
        display: flex;
        gap: 8px;
        font-size: 13px;
        color: var(--color-info);
    }

    .user-tag {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 6px;
    }

    .user-address {
        margin-top: -8px;
        padding: 16px;
        border-top: 1px solid var(--color-border-lighter);

        > .plain-link {
            display: flex;
            align-items: center;
            gap: 4px;
            width: fit-content;
            margin-inline: auto;
        }
    }
</style>