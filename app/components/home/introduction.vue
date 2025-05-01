<script lang="ts" setup>
    const layer = ref(["outer", "inner"]);
    const novels = computed(() => Object.keys(Article.meta));
    const indices = ref([0, 1]);
    let state = 1;

    //表里互换
    function exchange() {
        state ^= 1;

        //首位小说入队尾
        indices.value[state] = (indices.value[state] + 2) % novels.value.length;

        //交换层级
        layer.value.reverse();
    }
</script>

<template>
    <div class="home-introduction">
        <intro-card
            v-for="i in 2"
            :layer="layer[i - 1]"
            :novel="novels[indices[i - 1]]"
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
