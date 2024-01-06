<script setup>
    const modelValue = defineModel();
    const props = defineProps({
        count: Number
    });

    //总页数
    const totalPages = computed(() => {
        return Math.ceil(props.count / 10);
    });

    //中间页选项
    const middleCount = computed(() => {
        const page = modelValue.value;
        const total = totalPages.value;

        return [
            (page > 2)                 && page - 1,
            (page > 1 && page < total) && page,
            (page < total - 1)         && page + 1
        ].filter((i) => i);
    });
</script>

<template>
    <div class="mb-pagination">
        <a class="pagina-arr" :class="{ disabled: modelValue === 1 }" @click="modelValue--">
            <fa-icon icon="chevron-left"/>
        </a>
        <ul class="pagina-list">
            <a
                class="pagina-item"
                :class="{ active: modelValue === 1 }"
                @click="modelValue = 1"
            >1</a>
            <a
                v-if="modelValue > 3"
                class="pagina-item"
                @click="modelValue -= 2"
            >...</a>
            <li v-for="i in middleCount">
                <a
                    class="pagina-item"
                    :class="{ active: modelValue === i }"
                    @click="modelValue = i"
                >{{ i }}</a>
            </li>
            <a
                v-if="modelValue < totalPages - 2"
                class="pagina-item"
                @click="modelValue += 2"
            >...</a>
            <a
                v-if="totalPages > 1"
                class="pagina-item"
                :class="{ active: modelValue === totalPages }"
                @click="modelValue = totalPages"
            >{{ totalPages }}</a>
        </ul>
        <a class="pagina-arr" :class="{ disabled: modelValue === totalPages }" @click="modelValue++">
            <fa-icon icon="chevron-right"/>
        </a>
    </div>
</template>

<style lang="scss" scoped>
    .mb-pagination {
        display: flex;
        justify-content: center;
        font-size: 14px;
        color: var(--color-gray);
        user-select: none;

        a {
            display: grid;
            place-items: center;
            height: 2em;
            margin-inline: 4px;
            border: 1px solid var(--color-border-light);
            background-color: var(--color-background);
            transition: border-color 0.25s;

            &:not(.active):hover {
                border-width: 2px;
                border-color: var(--color-theme-dark);
                color: var(--color-theme-text);
            }

            &.disabled {
                opacity: 0.5;
                pointer-events: none;
            }
        }
    }

    .pagina-arr {
        width: 3em;
        border-radius: var(--circle-radius);
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