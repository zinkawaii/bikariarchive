<template>
    <h2 class="content-h2 coco-title"><slot></slot></h2>
</template>

<style lang="scss">
    .coco-title {
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