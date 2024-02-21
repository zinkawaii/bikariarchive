<script setup>
    import { EntryKnownAbility } from "#components";
    import jEntry from "~/dist/json/Entry.json";
    import Unknown from "./unknown.vue";

    const route = useRoute();

    const components = {
        "known-ability": EntryKnownAbility
    };

    const { title } = route.params;
    const isExist = ref(false);
    let category = "";
    let data = null;

    for (const key in jEntry.category) {
        const jList = jEntry.category[key];
        if (jList.includes(title)) {
            category = key;

            //获取数据
            ({ data } = await useFetch("/api/entry", {
                query: {
                    category,
                    title
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
        <header class="entry-header">
            <h1 class="entry-title">{{ data.title }}</h1>
        </header>
        <article class="entry-article">
            <section class="entry-section entry-main">
                <div class="left">
                    <div class="entry-summary">
                        <p v-for="text in splitByNewline(data.summary)" v-html="text"></p>
                    </div>
                    <div v-if="data.info?.length > 0" class="div-table entry-brief">
                        <dl v-for="i in data.info.length">
                            <template v-for="item in data.info[i - 1]">
                                <dt>{{ item[0] }}</dt>
                                <dd>{{ item[1] }}</dd>
                            </template>
                        </dl>
                    </div>
                </div>
                <mb-tab
                    v-if="data.illustration?.length > 0"
                    class="entry-illustration"
                    :item="data.illustration.map(item => item.title)"
                    ><template v-for="item in data.illustration" #[item.title]>
                        <mb-gallery :illustrator="item.illustrator">
                            <mb-image :src="item.src" viewable/>
                        </mb-gallery>
                    </template>
                </mb-tab>
            </section>
            <template v-if="category === `character`">
                <section class="entry-section">
                    <h2>能力</h2>
                    <template v-if="data.talent?.length > 0">
                        <div v-for="item in data.talent">
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
                            <p v-for="text in splitByNewline(item.content)" v-html="text"></p>
                        </div>
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
                        <p>{{ item.description }}</p>
                    </div>
                </section>
            </template>
            <section v-for="item in data.details" class="entry-section">
                <h2>{{ item.title }}</h2>
                <component v-if="item.component" :is="components[item.component]" v-bind="item.attrs"/>
                <template v-else>
                    <p v-for="text in splitByNewline(item.content)" v-html="text"></p>
                </template>
            </section>
        </article>
    </coco-widget>
    <Unknown v-else />
</template>

<style lang="scss" scoped>
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

    .talent-header, .relation-header {
        display: flex;
        align-items: baseline;
        overflow: hidden;
        text-wrap: nowrap;
    }

    .talent-tag {
        margin-left: 6px;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 13px;
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