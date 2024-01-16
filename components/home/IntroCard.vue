<script setup>
    import jArticle from "~/dist/json/Article.json";

    const emits = defineEmits(["exchange"]);
    const props = defineProps(["layer", "novel"]);

    const readRecordStore = useReadRecordStore();

    //简介
    const synopsis = computed(() => {
        return jArticle[props.novel].synopsis.split("\n");
    });

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
        <ul class="intro-tag">
            <li v-for="tag in jArticle[novel].tag">{{ tag }}</li>
        </ul>
        <div class="intro-synopsis">
            <p v-for="line in synopsis">{{ line }}</p>
        </div>
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

    .intro-tag {
        display: flex;
        gap: 12px;
        overflow: auto;
        margin-block: 8px;

        &::-webkit-scrollbar {
            display: none;
        }

        > li {
            padding-inline: 12px;
            border: 1px solid var(--color-border-light);
            border-radius: 12px;
            line-height: 24px;
            word-break: keep-all;
        }
    }

    .intro-synopsis {
        flex: 1;
        overflow: auto;
    }

    .intro-record {
        padding-top: 8px;
        border-top: 1px solid var(--color-border-light);
        text-align: center;

        span {
            color: var(--color-gray);
        }

        a {
            margin-inline: 20px;
            transition: all 0.2s;

            &:hover {
                margin-inline: 8px;
            }
        }
    }
</style>