<script setup>
    const props = defineProps(["layer", "novel"]);
    const emits = defineEmits(["exchange"]);

    const readRecordStore = useReadRecordStore();

    //阅读记录
    const record = computed(() => {
        const data = readRecordStore.get(props.novel);
        return data ? {
            title: data.title,
            link: `/book/${props.novel}/${data.index}`
        } : {
            title: "开始阅读",
            link: `/book/${props.novel}/000`
        };
    });

    //点击交换
    function exchange() {
        if (props.layer === "inner") {
            emits("exchange");
        }
    }
</script>

<template>
    <div class="content-table intro-card" :layer="layer" @click="exchange">
        <h2 class="content-h2">{{ jArticle[novel].title }}</h2>
        <intro-content :novel="novel"/>
        <div class="intro-record">
            <span>&gt;</span>
            <coco-link :to="record.link">{{ record.title }}</coco-link>
            <span>&lt;</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .intro-card {
        $gap: 24px;

        display: flex;
        flex-direction: column;
        position: absolute;
        width: calc(100% - $gap);
        height: calc(100% - $gap);
        transition-property: filter, translate;
        transition-duration: 0.25s;

        &[layer="outer"] {
            z-index: 1;
        }

        &[layer="inner"] {
            translate: $gap $gap;
            cursor: pointer;
            filter: brightness(75%) opacity(50%);
        }
    }

    .intro-content {
        margin-top: 8px;
    }

    .intro-record {
        margin-top: auto;
        padding-top: 8px;
        border-top: 1px solid var(--color-border-lighter);
        text-align: center;
        color: var(--color-text-info);

        > a {
            margin-inline: 20px;
            transition: all 0.2s;

            &:hover {
                margin-inline: 8px;
            }
        }
    }
</style>