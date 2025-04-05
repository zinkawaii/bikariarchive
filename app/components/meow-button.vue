<script lang="ts" setup>
    defineProps<{
        icon: string;
    }>();

    const code = ref("#???");

    onMounted(() => {
        code.value = "#" + randomInt(0, 256).toString().padStart(3, "0");
    });
</script>

<template>
    <button class="meow-button">
        <iconify class="button-icon" :name="icon"/>
        <span class="button-title" :code><slot></slot></span>
    </button>
</template>

<style lang="scss" scoped>
    .meow-button {
        display: flex;
        align-items: flex-end;
        position: relative;
        padding-left: 16px;
    }

    .button-icon {
        position: absolute;
        opacity: 0.4;
        left: 0;
        font-size: 36px;
        color: var(--color-info);
        transform-origin: left bottom;
        transition: scale 0.25s;

        :hover > & {
            scale: 1.14;
        }
    }

    .button-title {
        display: flex;
        position: relative;
        font-family: var(--font-smooth);
        font-size: 18px;
        color: var(--color-theme-text);

        &::before {
            content: attr(code);
            position: absolute;
            top: calc(-2px - 1em);
            right: 0;
            font-family: var(--font-code);
            font-size: 12px;
            color: var(--color-info);
        }
    }
</style>