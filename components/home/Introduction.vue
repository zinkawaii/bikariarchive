<script setup>
    import jArticle from "~/dist/json/Article.json";

    const intro = ref({
        status: 0,
        novel: [...Object.keys(jArticle)],
        layer: ["outer", "inner"],
        translate: []
    });

    //表里互换
    function exchange() {
        intro.value.status ^= 1;

        //首位小说入队尾
        const novel = intro.value.novel.shift();
        intro.value.novel.push(novel);

        //交换层级
        const { layer } = intro.value;
        layer.reverse();
    }
</script>

<template>
    <div class="home-introduction">
        <home-intro-card
            v-for="i in 2"
            :style="{ translate: intro.translate[i - 1] }"
            :layer="intro.layer[i - 1]"
            :novel="intro.novel[intro.status ? 2 - i : i - 1]"
            @exchange="exchange"
        />
    </div>
</template>

<style lang="scss" scoped>
    .home-introduction {
        position: relative;

        @container main (width < 768px) {
            height: 332px;
        }
    }
</style>