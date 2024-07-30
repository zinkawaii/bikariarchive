<script lang="ts" setup>
    const props = withDefaults(defineProps<{
        total: number;
        sizes?: number;
        scrollTarget?: string;
        scrollOffset?: number;
    }>(), {
        sizes: 10,
        scrollOffset: 64
    });
    const modelValue = defineModel<number>();

    //组件根元素
    const rootEl = useCurrentElement<HTMLElement>();

    //总页数
    const totalPages = computed(() => {
        return Math.max(1, Math.ceil(props.total / props.sizes));
    });

    //中间页选项
    const middleCount = computed(() => {
        const page = modelValue.value;
        const total = totalPages.value;

        return [
            (page > 2) && page - 1,
            (page > 1 && page < total) && page,
            (page < total - 1) && page + 1
        ].filter((i) => i);
    });

    //滑动根元素
    const scrollElement = computed(() => {
        return rootEl.value?.closest(props.scrollTarget) ?? document.querySelector(props.scrollTarget);
    });

    //切换页数时滑动到指定元素的起始位置
    watch(modelValue, () => {
        if (scrollElement.value) {
            const pos = getPosition(scrollElement.value);
            window.scrollTo({
                top: pos.top - props.scrollOffset
            });
        }
    });
</script>

<template>
    <div class="mb-pagination">
        <a class="pagina-arr" :class="{ [`is-disabled`]: modelValue === 1 }" @click="modelValue--">
            <icon name="fa6-solid:chevron-left"/>
        </a>
        <div class="pagina-list">
            <a
                class="pagina-item"
                :class="{ active: modelValue === 1 }"
                @click="modelValue = 1"
            >1</a>
            <a
                v-show="modelValue > 3"
                class="pagina-item"
                @click="modelValue -= 2"
            >...</a>
            <a
                v-for="i in middleCount"
                class="pagina-item"
                :class="{ active: modelValue === i }"
                @click="modelValue = i"
            >{{ i }}</a>
            <a
                v-show="modelValue < totalPages - 2"
                class="pagina-item"
                @click="modelValue += 2"
            >...</a>
            <a
                v-if="totalPages > 1"
                class="pagina-item"
                :class="{ active: modelValue === totalPages }"
                @click="modelValue = totalPages"
            >{{ totalPages }}</a>
        </div>
        <a class="pagina-arr" :class="{ [`is-disabled`]: modelValue === totalPages }" @click="modelValue++">
            <icon name="fa6-solid:chevron-right"/>
        </a>
    </div>
</template>

<style lang="scss" scoped>
    .mb-pagination {
        display: flex;
        justify-content: center;
        font-size: 14px;
        color: var(--color-text-info);
        user-select: none;
    }

    .pagina-arr, .pagina-item {
        display: grid;
        place-items: center;
        height: 2em;
        margin-inline: 4px;
        border: 1px solid var(--color-border-lighter);
        background-color: var(--color-background);
        transition: border-color 0.25s;

        &:not(.active):hover {
            border-width: 2px;
            border-color: var(--color-theme-dark);
            color: var(--color-theme-text);
        }

        &.is-disabled {
            opacity: 0.5;
            pointer-events: none;
        }
    }

    .pagina-arr {
        width: 3em;
        border-radius: var(--bounded-full);
    }

    .pagina-list {
        display: flex;
    }

    .pagina-item {
        width: 2em;
        border-radius: 8px;

        &.active {
            border-color: var(--color-theme-dark);
            background-color: var(--color-theme-dark);
            font-weight: bold;
            color: white;
        }
    }
</style>