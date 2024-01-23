<template>
    <div class="content-widget home-update">
        <coco-title>历史章节</coco-title>
        <recent-article type="novel" :limit="10"/>
    </div>
</template>

<style lang="scss" scoped>
    .home-update {
        grid-area: A;
        width: 256px;
        padding: 16px var(--cw-large);
    }

    @container main (width < 596px) {
        .home-update {
            width: 100%;
        }

        :deep(.recent-article) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 16px;
        }
    }
</style>