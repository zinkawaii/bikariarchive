<script setup>
    import jInfo from "~/assets/json/Info.json";
    import Character from "./character.vue";
    import Details from "./details.vue";

    const route = useRoute();
    const router = useRouter();

    const { title } = route.params;
    const template = shallowRef();
    let category = "";
    let data = null;

    let isExist = false;
    for (const key in jInfo) {
        const jList = jInfo[key];
        if (jList.includes(title)) {
            template.value = key === "character" ? Character : Details;
            category = key;

            //获取数据
            ({ data } = await useFetch("/api/entry", {
                query: {
                    category: category,
                    title: title
                }
            }));

            //设置标题
            useHead({
                title
            });

            isExist = true;
            break;
        }
    }

    if (!isExist) {
        router.replace({ name: "unknown" });
    }
</script>

<template>
    <div class="content-group">
        <component :is="template" :title="title" :category="category" :data="data"></component>
    </div>
</template>

<style lang="scss">
    .detail-header {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border);
    }

    .detail-main {
        display: flex;
        gap: 16px;

        > .left {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
        }
    }

    .detail-brief {
        margin: 8px 0 0;

        dt {
            width: 30%;
        }

        dd {
            width: 70%;
        }
    }

    .detail-illustration {
        width: min(336px, 100%);
        margin: auto;
    }

    .detail-block {
        overflow: auto;
        margin-top: 8px;

        > h2 {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--color-border);
        }
    }

    .detail-known {
        padding: 0 0 0 32px;
        font-size: 14px;
        line-height: 26px;

        > li {
            list-style-type: disc;
        }
    }

    .detail-relation {
        display: grid;
        grid: auto / repeat(auto-fill, minmax(min(216px, 100%), 1fr));
        grid-gap: 16px;
        margin: 16px 0 0;
    }
</style>