<script lang="ts" setup>
    import { EntryKnownAbility } from "#components";
    import jEntry from "~~/dist/json/Entry.json";

    defineOptions({
        components: {
            "known-ability": EntryKnownAbility
        }
    });
    const { title } = defineProps<{
        title: string;
    }>();

    useHead({
        title
    });

    const route = useRoute();
    const isExist = jEntry.all.includes(title);

    const { status, data } = useLazyFetch("/api/entry", {
        query: {
            title
        },
        immediate: isExist
    });

    //显示评论区
    onMounted(() => {
        route.meta.comment = isExist;
    });
</script>

<template>
    <coco-widget v-if="isExist">
        <header class="entry-header">
            <h1 class="entry-title">{{ title }}</h1>
        </header>
        <mb-skeleton v-if="status !== `success`"/>
        <article v-else class="entry-article">
            <section class="entry-section">
                <div class="entry-main">
                    <div class="novel-text" v-html="data.summary"></div>
                    <entry-appearance v-if="data.appearance" v-bind="data.appearance"/>
                    <entry-brief v-if="data.brief" v-bind="data.brief"/>
                </div>
                <entry-illustration v-if="data.illustration" :data="data.illustration"/>
            </section>
            <template v-if="data.category === `character`">
                <entry-talent :data="data.talent"/>
                <entry-relationship :data="data.relationship"/>
            </template>
            <entry-section v-for="item in data.details" :title="item.title">
                <component v-if="item.component" :is="$options.components[item.component]" v-bind="item.attrs"/>
                <div v-else class="novel-text" v-html="item.content"></div>
            </entry-section>
        </article>
    </coco-widget>
    <not-found v-else/>
</template>

<style lang="scss" scoped>
    .entry-header {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border);
    }

    .entry-section {
        margin-top: 16px;

        &:first-child {
            display: flex;
            gap: 16px;
            margin-top: 8px;

            @include viewport("md") {
                flex-direction: column;
            }
        }

        :deep(> h2) {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--color-border);
        }

        :deep(h3) {
            display: inline-block;
            margin: 8px 0 4px 12px;
            line-height: 26px;

            &::before {
                content: "·";
                font-weight: bold;
            }
        }
    }

    .entry-main {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
    }
</style>