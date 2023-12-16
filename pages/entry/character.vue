<script setup>
    const props = defineProps(["data"]);
</script>

<template>
    <header class="entry-header">
        <h1 class="entry-title">{{ data.title }}</h1>
    </header>
    <article class="entry-article">
        <section class="entry-section entry-main">
            <div class="left">
                <div class="entry-summary">
                    <p v-for="text in toSplit(data.summary)" v-html="text"></p>
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
                        <mb-image :src="item.src"/>
                    </mb-gallery>
                </template>
            </mb-tab>
        </section>
        <section class="entry-section">
            <h2>能力</h2>
            <template v-if="data.talent?.length > 0">
                <div v-for="item in data.talent" class="talent-block">
                    <div class="talent-header">
                        <template v-if="item.type === `超能力`">
                            <h3>· {{ item.name.zh }}</h3>
                            <div>
                                <nuxt-link
                                    v-for="cls in item.class"
                                    class="tab talent-tab"
                                    :to="toEntry(`${cls}系`)"
                                >{{ cls }}</nuxt-link>
                                <nuxt-link
                                    class="tab talent-tab"
                                    :to="toEntry(`能力评级`)"
                                >Star {{ item.star }}</nuxt-link>
                                <span class="tab talent-tab">{{ item.name.en }}</span>
                            </div>
                        </template>
                        <template v-else>
                            <h3>· {{ item.name }}</h3>
                        </template>
                    </div>
                    <p v-for="text in toSplit(item.content)" v-html="text"></p>
                </div>
            </template>
            <p v-else>未知。</p>
        </section>
        <section v-if="data.relationship?.length > 0" class="entry-section">
            <h2>人物关系</h2>
            <div class="entry-relation">
                <div v-for="item in data.relationship" class="relation-wrapper">
                    <nuxt-img
                        class="relation-icon"
                        :src="`/garden/icon/${item.name}.png`"
                        placeholder="/garden/icon/unknown.png"
                    />
                    <div>
                        <nuxt-link class="relation-name" :to="toEntry(item.name)">{{ item.name }}</nuxt-link>
                        <span class="relation-sub">{{ item.relation }}</span>
                    </div>
                </div>
            </div>
        </section>
    </article>
</template>

<style lang="scss" scoped>
    .talent-block {
        margin: 4px 0 0;
        padding: 4px 0 0;
    }

    .talent-header {
        display: flex;
        align-items: center;
        overflow: hidden;
        text-wrap: nowrap;

        > h3 {
            line-height: 26px;
            text-indent: 19px;
        }
    }

    .talent-tab {
        margin-left: 6px;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 13px;
    }

    .relation-wrapper {
        display: flex;
        gap: 16px;
        padding: 16px;
        border: 1px solid var(--color-border-light);
        border-left: 16px solid var(--color-theme-block);
        background-color: var(--color-background);
    }

    .relation-icon {
        width: 64px;
        height: 64px;
        filter: drop-shadow(4px 4px 6px rgb(0 0 0 / 24%));
        z-index: 0;
    }

    .relation-name {
        display: block;
        width: fit-content;
    }

    .relation-sub {
        display: inline-block;
        width: fit-content;
        margin: 4px 0;
        font-size: 14px;
        color: var(--color-gray);
    }
</style>