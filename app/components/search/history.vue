<script lang="ts" setup>
    import { injectionKey } from "~/types/search";

    const toastStore = useToastStore();
    const history = useLocalStorage("search-history", []);
    const { searchWord } = inject(injectionKey);

    //更新历史
    watch(searchWord, (word) => {
        const pos = history.value.indexOf(word);
        if (pos !== -1) {
            history.value.splice(pos, 1);
        }
        history.value.unshift(word);
        history.value.splice(16);
    });

    //清空历史
    async function clear() {
        if (await Zin.confirm("是否清空历史词条？")) {
            history.value.length = 0;
            toastStore.success("[search]:clear", "历史词条已清空");
        }
    }
</script>

<template>
    <div class="search-history">
        <div class="history-title">
            <span>历史词条</span>
            <button @click="clear">
                <iconify name="fa6-solid:trash-can"/>
            </button>
        </div>
        <client-only>
            <ul v-if="history.length" class="history-list">
                <li v-for="word in history" :key="word">
                    <nuxt-link class="history-item tag text-truncate" :to="toSearch(word)">{{ word }}</nuxt-link>
                </li>
            </ul>
        </client-only>
    </div>
</template>

<style lang="scss" scoped>
    .search-history {
        margin-top: 16px;
        color: var(--color-info);
    }

    .history-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .history-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 8px;
        font-size: 14px;
    }

    .history-item {
        display: block;
        max-width: 112px;
        padding: 4px 8px;
        border-radius: 4px;
    }
</style>