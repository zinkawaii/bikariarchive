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
        padding: 16px 32px;
    }

    @container main (width < 596px) {
        .home-update {
            width: 100%;
            padding-inline: 16px;
        }

        :deep(.recent-article) {
            display: grid;
            column-gap: 16px;
            grid-template-columns: 1fr 1fr;
        }
    }
</style>