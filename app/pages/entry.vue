<script lang="ts" setup>
    const { title } = defineProps<{
        title: string;
    }>();

    definePageMeta({
        path: "/:title()",
        props: true,
        catalog: true,
        comment: true,
    });

    useHead({
        title,
    });

    useBreadcrumb({
        name: "intel",
    });

    const { hooks } = useHookStore();
    const route = useRoute();

    const isExist = computed(() => {
        return Entry.meta.all.includes(title) || Entry.meta.drafts.includes(title);
    });

    const { status, data } = useLazyFetch("/api/entry", {
        query: {
            title,
        },
        immediate: isExist.value,
        watch: [Entry.meta],
    });

    //显示评论区
    watch(isExist, (val) => {
        route.meta.comment = val;
    }, {
        immediate: import.meta.browser,
    });
</script>

<template>
    <meow-widget v-if="isExist">
        <header class="entry-header">
            <h1 class="entry-title">{{ data?.title ?? title }}</h1>
        </header>
        <mb-skeleton v-if="status !== `success`"/>
        <article
            v-else-if="data"
            class="entry-article"
            @vue:mounted="hooks.callHook(`article:rendered`, `.entry-article`)"
        >
            <section class="entry-leading">
                <div class="entry-primary">
                    <novel-article as="div" :body="data.summary"/>
                    <entry-appearance v-if="data.appearance" v-bind="data.appearance"/>
                    <entry-brief v-if="data.brief" v-bind="data.brief"/>
                </div>
                <entry-illustration v-if="data.illustrations" :data="data.illustrations"/>
            </section>
            <template v-if="data.category === `character`">
                <entry-talent :data="data.talents"/>
                <entry-relationship :data="data.relationships"/>
            </template>
            <entry-detail v-for="detail in data.details" v-bind="detail"/>
        </article>
    </meow-widget>
    <not-found v-else/>
</template>

<style lang="scss" scoped>
    .entry-header {
        padding-bottom: 12px;
        border-bottom: 1px solid var(--color-border);
    }

    :where(.mb-skeleton, .entry-section) {
        margin-top: 24px;
    }

    .entry-leading {
        display: flex;
        gap: 16px;
        margin-top: 8px;

        @include viewport("md") {
            flex-direction: column;
        }
    }

    .entry-primary {
        container: entry-primary / inline-size;
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
    }
</style>

<style lang="scss">
    .entry-section {
        > h2 {
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--color-border);
        }

        h3 {
            display: inline-block;
            margin: 8px 0 4px 12px;

            &::before {
                content: "•";
                display: inline-block;
                width: 1em;
                text-align: center;
            }
        }
    }
</style>
