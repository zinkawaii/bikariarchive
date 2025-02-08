<script lang="ts" setup>
    const status = ref(0);
    const layer = ref(["outer", "inner"]);
    const novels = computed(() => Object.keys(Article.meta));

    //表里互换
    function exchange() {
        status.value ^= 1;

        //首位小说入队尾
        const novel = novels.value.shift()!;
        novels.value.push(novel);

        //交换层级
        layer.value.reverse();
    }
</script>

<template>
    <div class="home-introduction">
        <intro-card
            v-for="i in 2"
            :layer="layer[i - 1]"
            :novel="novels[status ? 2 - i : i - 1]"
            @exchange="exchange"
        />
    </div>
</template>

<style lang="scss" scoped>
    .home-introduction {
        position: relative;

        @include viewport("md") {
            height: 332px;
        }
    }
</style>