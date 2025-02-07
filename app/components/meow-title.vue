<template>
    <h2 class="meow-title content-h2"><slot></slot></h2>
</template>

<style lang="scss" scoped>
    .meow-title {
        width: fit-content;
        margin-bottom: 4px;

        &::after {
            content: "";
            display: block;
            margin: -9px -4px 0;
            padding: 5px;
            background-color: var(--color-theme);
        }
    }
</style>