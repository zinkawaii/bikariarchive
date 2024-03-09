<script setup>
    const catalogueStore = useCatalogueStore();
    const { novel, jVolume, jChapters } = storeToRefs(catalogueStore);

    //信息类型
    const infoType = ref(1);

    //总字数
    const totalCount = computed(() => {
        return jChapters.value.reduce((res, c) => {
            return res + c.wordCount;
        }, 0);
    });

    //最近更新
    const lastUpdated = computed(() => {
        return jChapters.value.reduce(([date, prev], curr) => {
            const a = prev.updated ?? prev.date ?? prev.refactored ?? "";
            const b = curr.updated ?? curr.date ?? curr.refactored ?? "";
            return a.localeCompare(b) > 0 ? [a, prev] : [b, curr];
        }, ["很久以前", {}])[0];
    });

    //状态
    const updateState = computed(() => {
        return jVolume.value?.ending ? "已完结" : "连载中";
    });
</script>

<template>
    <div class="catalogue-control">
        <div class="catalogue-property">
            <span>总字数</span>
            <span>{{ totalCount }}</span>
        </div>
        <div class="catalogue-property">
            <span>最近更新</span>
            <span>{{ lastUpdated }}</span>
        </div>
        <div class="catalogue-property">
            <span>状态</span>
            <span>{{ updateState }}</span>
        </div>
        <div class="catalogue-property">
            <span>显示</span>
            <form class="catalogue-display">
                <label><input type="radio" :value="0" v-model="infoType"/>字数</label>
                <label><input type="radio" :value="1" v-model="infoType"/>发布日期</label>
            </form>
        </div>
    </div>
    <ul class="catalogue-chapter">
        <li v-for="{ index, title, date, refactored, wordCount }, i in jChapters">
            <nuxt-link :to="{ name: `reader`, params: { novel, index }}">
                <span class="info order">{{ i + 1 }}.</span>
                <span class="text-truncate">{{ title }}</span>
                <span class="info">
                    <template v-if="infoType === 0">{{ wordCount }} 字</template>
                    <template v-else-if="infoType === 1">{{ date ?? refactored ?? "很久以前" }}</template>
                </span>
            </nuxt-link>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .catalogue-control {
        display: flex;
        flex-wrap: wrap;
        column-gap: 1.5em;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 2em;
        color: var(--color-text-info);
    }

    .catalogue-property {
        display: flex;
        gap: 0.75em;

        > span:first-child {
            font-weight: bold;
            color: var(--color-theme-text);
        }

        &:last-child {
            margin-left: auto;
        }
    }

    .catalogue-display {
        display: flex;
        gap: 0.75em;

        > label:has(> :checked) {
            color: var(--color-theme-dark);
        }

        input {
            display: none;
        }
    }

    .catalogue-chapter {
        @container main (width >= 596px) {
            columns: 2;
            column-gap: 2em;
        }

        a {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: 8px;
            border-bottom: 1px dashed var(--color-border-light);
            line-height: 36px;

            &:hover {
                color: var(--color-theme-text);
            }

            .order {
                font-style: italic;
            }

            .info {
                font-size: 14px;
                color: var(--color-text-info);
            }
        }
    }
</style>