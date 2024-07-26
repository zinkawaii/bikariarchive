<script lang="ts" setup>
    import { EntryKnownAbility } from "#components";
    import jEntry from "~~/dist/json/Entry.json";

    defineOptions({
        components: {
            "known-ability": EntryKnownAbility
        }
    });
    const props = defineProps<{
        title: string;
    }>();

    const route = useRoute();
    const isExist = jEntry.all.includes(props.title);

    useHead({
        title: props.title
    });

    const { status, data } = useLazyFetch("/api/entry", {
        query: {
            title: props.title
        },
        immediate: isExist
    });

    const appearArt = computed(() => {
        try {
            const { novel, index } = data.value.appearance;
            return Article.for(novel, index);
        }
        catch {
            return null;
        }
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
                    <div class="entry-text" v-html="data.summary"></div>
                    <p v-if="appearArt" class="entry-appearance">
                        首次登场于
                        <plain-link @click="guideToShelf(appearArt.novel, appearArt.volume)">{{ appearArt.volumeInfo.title }}</plain-link>
                        -
                        <plain-link :to="appearArt.route">{{ appearArt.title }}</plain-link>
                    </p>
                    <entry-brief v-if="data.brief" v-bind="data.brief"/>
                </div>
                <mb-tab
                    v-if="data.illustration?.length > 0"
                    class="entry-illustration"
                    :items="data.illustration.map(item => item.title)"
                    ><template v-for="item in data.illustration" #[item.title]>
                        <mb-gallery :illustrator="item.illustrator">
                            <mb-image :src="item.src" alt="[illustration]"/>
                        </mb-gallery>
                    </template>
                </mb-tab>
            </section>
            <template v-if="data.category === `character`">
                <section class="entry-section">
                    <h2>能力</h2>
                    <template v-if="data.talent?.length > 0">
                        <template v-for="item in data.talent">
                            <div class="talent-header">
                                <template v-if="item.type === `超能力`">
                                    <h3>{{ item.name.zh }}</h3>
                                    <nuxt-link
                                        v-for="cls in item.class"
                                        class="tag talent-tag"
                                        :to="toEntry(`${cls}系`)"
                                    >{{ cls }}</nuxt-link>
                                    <nuxt-link
                                        class="tag talent-tag"
                                        :to="toEntry(`能力评级`)"
                                    >Star {{ item.star }}</nuxt-link>
                                    <span class="tag talent-tag">{{ item.name.en }}</span>
                                </template>
                                <template v-else>
                                    <h3>{{ item.name }}</h3>
                                </template>
                            </div>
                            <div class="entry-text" v-html="item.content"></div>
                        </template>
                    </template>
                    <p v-else>未知。</p>
                </section>
                <section v-if="data.relationship?.length > 0" class="entry-section">
                    <h2>人际关系</h2>
                    <div v-for="item in data.relationship">
                        <div class="relation-header">
                            <h3><character-tag :name="item.name"/></h3>
                            <span class="relation-ship">：{{ item.relation }}</span>
                        </div>
                        <div class="entry-text" v-html="item.content"></div>
                    </div>
                </section>
            </template>
            <section v-for="item in data.details" class="entry-section">
                <h2>{{ item.title }}</h2>
                <component v-if="item.component" :is="$options.components[item.component]" v-bind="item.attrs"/>
                <div v-else class="entry-text" v-html="item.content"></div>
            </section>
        </article>
    </coco-widget>
    <not-found v-else/>
</template>

<style lang="scss" scoped>
    .entry-header {
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--color-border);
    }

    .entry-section {
        &:first-child {
            display: flex;
            gap: 16px;
            margin-top: -8px;

            @include viewport("md") {
                flex-direction: column;
            }
        }
    }

    .entry-main {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: space-between;
    }

    .entry-appearance {
        margin-top: auto;
        font-size: 12px;
        text-align: right;
        color: var(--color-text-info);
    }

    .entry-illustration {
        width: min(336px, 100%);
        margin-inline: auto;
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
            margin: 8px 0 4px 12px;
            line-height: 26px;

            &::before {
                content: "·";
                font-weight: bold;
            }
        }
    }

    .talent-header, .relation-header {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
    }

    .talent-tag {
        margin: 2px 0 0 6px;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 13px;
    }
</style>