<script setup>
    import jEntry from "~/assets/json/Entry.json";
    import Character from "./character.vue";
    import General from "./general.vue";
    import Unknown from "../unknown.vue";

    const route = useRoute();

    const { title } = route.params;
    const template = shallowRef();
    const isExist = ref(false);
    let category = "";
    let data = null;

    for (const key in jEntry.category) {
        const jList = jEntry.category[key];
        if (jList.includes(title)) {
            template.value = (key === "character") ? Character : General;
            category = key;

            //获取数据
            ({ data } = await useFetch("/api/entry", {
                query: {
                    category: category,
                    title: title
                }
            }));

            //设置标题
            useHead({ title });

            isExist.value = true;
            break;
        }
    }
</script>

<template>
    <div v-if="isExist" class="content-group">
        <component :is="template" :data="data"/>
    </div>
    <Unknown v-else />
</template>

<style lang="scss">
    .entry-header {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border);
    }

    .entry-title, .entry-article :is(h1, h2, h3) {
        font-weight: bold;
    }

    .entry-main {
        display: flex;
        gap: 16px;

        > .left {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
        }
    }

    .entry-brief {
        margin: 8px 0 0;

        dt {
            width: 30%;
        }

        dd {
            width: 70%;
        }
    }

    .entry-illustration {
        width: min(336px, 100%);
        margin: auto;
    }

    .entry-section {
        overflow: auto;
        margin-top: 8px;

        > h2 {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--color-border);
        }
    }

    .entry-known {
        padding: 0 0 0 32px;
        font-size: 14px;
        line-height: 26px;

        > li {
            list-style-type: disc;
        }
    }

    .entry-relation {
        display: grid;
        grid: auto / repeat(auto-fill, minmax(min(216px, 100%), 1fr));
        grid-gap: 16px;
        margin: 16px 0 0;
    }

    @media (width < 768px) {
        .entry-main {
            flex-direction: column;
        }

        .entry-brief {
            flex-direction: column;
        }
    }
</style>