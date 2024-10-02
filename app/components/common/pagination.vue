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
    const rootEl = useTemplateRef("root");

    //总页数
    const totalPages = computed(() => {
        return Math.max(1, Math.ceil(props.total / props.sizes));
    });

    //显示页码
    const pages = computed(() => {
        const current = modelValue.value;
        const total = totalPages.value;
        const expand = 1;

        const start = Math.max(1, Math.min(total - 2 * expand, current - expand));
        const end = Math.min(total, start + 2 * expand);

        return [
            start > 1 && 1,
            start > 2 && (start === 3 ? 2 : -Infinity),
            ...[...new Array(end - start + 1)].map((_, i) => i + start),
            end < total - 1 && (end === total - 2 ? total - 1 : Infinity),
            end < total && total
        ].filter(Boolean);
    });

    //滑动根元素
    const scrollElement = computed(() => {
        return rootEl.value?.closest(props.scrollTarget) ?? document.querySelector(props.scrollTarget);
    });

    //切换页码时滑动到指定元素的起始位置
    watch(modelValue, () => {
        if (scrollElement.value) {
            const pos = getPosition(scrollElement.value);
            window.scrollTo({
                top: pos.top - props.scrollOffset
            });
        }
    });

    //点击页码时
    async function selectPage(val: number) {
        modelValue.value = modelValue.value === val ? await Zin.numeric({
            title: "跳转到页码",
            initialValue: val,
            min: 1,
            max: totalPages.value
        }) : val;
    }
</script>

<template>
    <div ref="root" class="mb-pagination">
        <a class="pagina-arr" :class="{ [`is-disabled`]: modelValue === 1 }" @click="modelValue--">
            <iconify name="fa6-solid:chevron-left"/>
        </a>
        <div class="pagina-list">
            <template v-for="i in pages">
                <a
                    v-if="Number.isFinite(i)"
                    class="pagina-item"
                    :class="{ active: modelValue === i }"
                    @click="selectPage(i)"
                >{{ i }}</a>
                <a
                    v-else
                    class="pagina-item"
                    @click="modelValue += i > 0 ? 2 : -2"
                >...</a>
            </template>
        </div>
        <a class="pagina-arr" :class="{ [`is-disabled`]: modelValue === totalPages }" @click="modelValue++">
            <iconify name="fa6-solid:chevron-right"/>
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