<template>
    <div class="home-update content-widget">
        <meow-title>历史章节</meow-title>
        <recent-article type="novel" :sizes="10"/>
    </div>
</template>

<style lang="scss" scoped>
    .home-update {
        grid-area: A;
        width: 256px;
        padding: 16px var(--meow-large) var(--meow-medium);

        @include viewport("sm") {
            width: 100%;

            > .recent-article {
                grid-template-columns: 1fr 1fr;
                column-gap: 16px;
            }
        }
    }
</style>