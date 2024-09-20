<script lang="ts" setup>
    const modelValue = defineModel<string>();
    const emit = defineEmits<{
        decrypt: [];
    }>();
</script>

<template>
    <p class="novel-encrypted">
        <icon name="solar:lock-password-bold"/>
        <span>文章已加密，请输入正确的密码后查看内容</span>
        <icon name="solar:lock-password-bold"/>
    </p>
    <form class="novel-decrypt" @submit.prevent="emit(`decrypt`)">
        <coco-input type="password" placeholder="密码" v-model="modelValue"/>
    </form>
</template>

<style lang="scss" scoped>
    .novel-encrypted {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25em;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        color: var(--color-text-info);
    }

    .novel-decrypt {
        max-width: 616px;
        margin-inline: auto;
        padding-block: 32px;
    }
</style>