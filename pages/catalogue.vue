<script setup>
    import jArticle from "~/dist/json/Article.json";

    useHead({
        title: "目录"
    });

    const novel = ref("bikari");
    const curOrder = ref({
        novel: 0,
        volume: 0
    });

    const jNovel = computed(() => {
        return jArticle[novel.value];
    });

    const volumes = computed(() => {
        return jNovel.value.volumes.map((item) => {
            return item.title;
        });
    });

    const chapters = computed(() => {
        return jNovel.value.chapters.filter((c) => {
            return curOrder.value.volume === c.volume;
        });
    });

    function selectNovel(key, i) {
        novel.value = key;
        curOrder.value.novel = i;
        curOrder.value.volume = 0;
    }

    function selectVolume(vol) {
        curOrder.value.volume = vol;
    }
</script>

<template>
    <coco-widget title="目录">
        <div class="catalogue-shelf">
            <ul class="shelf-wrapper" :style="{ translate: curOrder.novel * -144 + `px` }">
                <li v-for="({ title, cover }, key, i) in jArticle">
                    <a
                        class="shelf-novel"
                        :class="{ checked: novel === key }"
                        @click="selectNovel(key, i)"
                        ><div class="shelf-cover">
                            <mb-image v-if="cover" :src="cover"/>
                            <div v-else class="shelf-placeholder">Cover.</div>
                        </div>
                        <span class="shelf-title">{{ title.split("-")[0] }}</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="catalogue-section">
            <fieldset class="catalogue-fieldset">
                <legend class="content-h2">{{ jNovel.title }}</legend>
                <intro-content :novel="novel"/>
            </fieldset>
            <fieldset v-show="volumes.length" class="catalogue-fieldset">
                <legend class="content-h2">卷册列表</legend>
                <ul class="catalogue-volume">
                    <li v-for="(title, i) in volumes">
                        <a
                            :class="{ checked: curOrder.volume === i }"
                            @click="selectVolume(i)"
                        >{{ title }}</a>
                    </li>
                </ul>
            </fieldset>
        </div>
        <fieldset v-show="chapters.length" class="catalogue-fieldset">
            <legend class="content-h2">章节列表</legend>
            <ul class="catalogue-chapter">
                <li v-for="chapter in chapters">
                    <nuxt-link :to="{ name: `reader`, params: { novel, index: chapter.index }}">
                        <span class="text-truncate">{{ chapter.title }}</span>
                        <time class="date">{{ chapter.refactored ?? chapter.date ?? "很久以前" }}</time>
                    </nuxt-link>
                </li>
            </ul>
        </fieldset>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .catalogue-shelf {
        padding-left: calc(50% - 72px);
        mask-image: linear-gradient(to right, transparent, white 32px, white calc(100% - 32px), transparent);
    }

    .shelf-wrapper {
        display: flex;
        width: fit-content;
        transition: all 0.4s;
    }

    .shelf-novel {
        display: grid;
        justify-items: center;
        margin-inline: 8px;
        color: var(--color-text-info);
    }

    .shelf-cover {
        width: 128px;
        aspect-ratio: 1 / 1.414;
        transform-origin: bottom;
        transition: all 0.4s;
        filter: drop-shadow(8px 8px 2px rgb(0 0 0 / 16%));

        :not(.checked) > & {
            opacity: 0.66;
            scale: 0.9;
        }
    }

    .shelf-placeholder {
        display: grid;
        place-items: center;
        height: 100%;
        border: 4px dashed var(--color-border);
        border-radius: 8px;
        font-size: 32px;
        font-weight: bold;
        user-select: none;
    }

    .shelf-title {
        line-height: 42px;

        .checked > & {
            color: var(--color-theme-text);
        }
    }

    .catalogue-section {
        display: flex;
        column-gap: 32px;
    }

    .catalogue-fieldset {
        flex: 1;
        margin-top: 16px;
        padding-top: 8px;
        border-top: 1px solid var(--color-border);

        > legend {
            margin: auto;
            padding-inline: 8px;
        }
    }

    .catalogue-volume {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(160px, 100%), 1fr));

        a {
            display: flex;
            justify-content: center;
            border: 1px solid transparent;
            border-radius: 4px;
            line-height: 32px;

            &:hover {
                border-color: var(--color-theme-dark);
            }

            &.checked {
                color: var(--color-theme-text);
            }
        }
    }

    .catalogue-chapter {
        a {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;
            border-bottom: 1px dashed var(--color-border-light);
            line-height: 36px;

            &:hover {
                color: var(--color-theme-text);
            }

            .date {
                font-size: 14px;
                color: var(--color-text-info);
            }
        }
    }

    @container main (width >= 596px) {
        .catalogue-chapter {
            columns: 2;
            column-gap: 2em;
        }
    }

    @container main (width < 768px) {
        .catalogue-section {
            flex-direction: column;
        }
    }
</style>