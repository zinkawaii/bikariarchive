<script lang="ts" setup>
    const { title } = defineProps<{
        title: string;
    }>();

    useHead({
        title
    });

    const route = useRoute();

    const isExist = computed(() => {
        return Entry.meta.all.includes(title);
    });

    const { status, data } = useLazyFetch("/api/entry", {
        query: {
            title
        },
        immediate: isExist.value,
        watch: [Entry.meta]
    });

    //显示评论区
    watch(isExist, (val) => {
        route.meta.comment = val;
    }, {
        immediate: import.meta.browser
    });
</script>

<template>
    <meow-widget v-if="isExist">
        <header class="entry-header">
            <h1 class="entry-title">{{ title }}</h1>
        </header>
        <mb-skeleton v-if="status !== `success`"/>
        <article v-else class="entry-article">
            <section class="entry-section">
                <div class="entry-main">
                    <novel-article tag="div" :body="data.summary"/>
                    <entry-appearance v-if="data.appearance" v-bind="data.appearance"/>
                    <entry-brief v-if="data.brief" v-bind="data.brief"/>
                </div>
                <entry-illustration v-if="data.illustration" :data="data.illustration"/>
            </section>
            <template v-if="data.category === `character`">
                <entry-talent :data="data.talent"/>
                <entry-relationship :data="data.relationship"/>
            </template>
            <entry-detail v-for="detail in data.details" v-bind="detail"/>
        </article>
    </meow-widget>
    <not-found v-else/>
</template>

<style lang="scss" scoped>
    .entry-header {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border);
    }

    :where(.mb-skeleton, .entry-section) {
        margin-top: 16px;
    }

    .entry-section {
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