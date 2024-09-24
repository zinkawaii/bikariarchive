<script lang="ts" setup>
    const props = defineProps<{
        layer: string;
        novel: string;
    }>();
    const emit = defineEmits<{
        exchange: [];
    }>();

    const readRecordStore = useReadRecordStore();

    //小说代号
    const code = computed(() => {
        return `- ${capitalize(props.novel)} -`;
    });

    //阅读记录
    const record = computed(() => {
        const data = readRecordStore.get(props.novel) ?? Article.meta[props.novel].chapters[0];
        return data ? {
            title: data.title ?? "开始阅读",
            to: `/book/${props.novel}/${data.index}`
        } : null;
    });

    //点击交换
    function exchange() {
        if (props.layer === "inner") {
            emit("exchange");
        }
    }
</script>

<template>
    <div class="content-table intro-card" :class="`is-${layer}`" @click="exchange">
        <h2 class="content-h2 intro-header">
            {{ Article.meta[novel].title }}
            <span class="text-truncate text-gray">{{ code }}</span>
        </h2>
        <intro-content :novel/>
        <div v-if="record" class="intro-record">
            <iconify name="fa6-solid:chevron-right"/>
            <plain-link class="intro-link" :to="record.to">{{ record.title }}</plain-link>
            <iconify name="fa6-solid:chevron-left"/>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .intro-card {
        $gap: 24px;

        display: grid;
        grid-template-rows: auto 1fr auto;
        position: absolute;
        width: calc(100% - $gap);
        height: calc(100% - $gap);
        transition-property: filter, translate;
        transition-duration: 0.25s;

        &.is-outer {
            z-index: 1;
        }

        &.is-inner {
            translate: $gap $gap;
            cursor: pointer;
            filter: brightness(75%) opacity(50%);
        }
    }

    .intro-header {
        display: flex;
        gap: 0.5em;
        overflow: hidden;
        margin-bottom: 8px;
        text-wrap: nowrap;
    }

    .intro-record {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 8px;
        border-top: 1px solid var(--color-border-lighter);
        color: var(--color-text-info);
    }

    .intro-link {
        margin-inline: 16px;
        transition: all 0.25s;

        &:hover {
            margin-inline: 8px;
        }
    }
</style>