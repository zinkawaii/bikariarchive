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
    <coco-widget v-if="isExist">
        <component :is="template" :data="data"/>
    </coco-widget>
    <Unknown v-else />
</template>

<style lang="scss">
    .entry-header {
        margin-bottom: 8px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border);
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
        margin-top: 8px;

        dl {
            --dt-fr: 0.3fr;
            --dd-fr: 0.7fr;
        }
    }

    .entry-illustration {
        width: min(336px, 100%);
        margin: auto;
    }

    .entry-article {
        display: grid;
        gap: 16px;

        h2 {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--color-border);
        }

        h3 {
            margin: 8px 0 0 12px;
            line-height: 26px;

            &::before {
                content: "·";
                font-weight: bold;
            }
        }
    }

    .entry-section {
        overflow: auto;
    }

    .entry-known {
        padding-left: 32px;
        font-size: 14px;
        line-height: 26px;

        > li {
            list-style-type: disc;
        }
    }

    @container main (width < 768px) {
        .entry-main {
            flex-direction: column;
        }

        .entry-brief {
            flex-direction: column;
        }
    }
</style>