<script lang="ts" setup>
    const shelfStore = useShelfStore();
    const { infoType, jChapters } = storeToRefs(shelfStore);

    //总字数
    const totalCount = computed(() => {
        return jChapters.value.reduce((res, c) => {
            return res + c.wordCount;
        }, 0);
    });

    //最近更新
    const lastUpdated = computed(() => {
        return (jChapters.value.length > 0) ?
            jChapters.value.reduce((prev, curr) => {
                const a = prev.updated || prev.date;
                const b = curr.updated || curr.date;
                return a.localeCompare(b) > 0 ? prev : curr;
            }).updateDate : Article.FARAWAY;
    });

    //状态
    const updateState = computed(() => {
        return jChapters.value.some((c) => c.ending) ? "已完结" : "连载中";
    });
</script>

<template>
    <div class="shelf-control">
        <div class="shelf-property">
            <span>总字数</span>
            <span>{{ totalCount }}</span>
        </div>
        <div class="shelf-property">
            <span>最近更新</span>
            <span>{{ lastUpdated }}</span>
        </div>
        <div class="shelf-property">
            <span>状态</span>
            <span>{{ updateState }}</span>
        </div>
        <div class="shelf-property">
            <span>显示</span>
            <form class="shelf-display">
                <label><input type="radio" :value="0" v-model="infoType"/>字数</label>
                <label><input type="radio" :value="1" v-model="infoType"/>发布日期</label>
            </form>
        </div>
    </div>
    <ul class="shelf-chapter">
        <li v-for="chapter in jChapters">
            <shelf-chapter-item :chapter/>
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .shelf-control {
        display: flex;
        flex-wrap: wrap;
        column-gap: 1.5em;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 2em;
        color: var(--color-text-info);
    }

    .shelf-property {
        display: flex;
        gap: 0.75em;

        &:last-child {
            margin-left: auto;
        }

        > :first-child {
            font-weight: bold;
            color: var(--color-theme-text);
        }
    }

    .shelf-display {
        display: flex;
        gap: 0.75em;

        > :has(> :checked) {
            color: var(--color-theme-dark);
        }

        input {
            display: none;
        }
    }

    .shelf-chapter {
        @container main (width >= 596px) {
            columns: 2;
            column-gap: 2em;
        }
    }
</style>