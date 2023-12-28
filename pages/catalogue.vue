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

    const volumes = computed(() => {
        return jArticle[novel.value].volume.map((item) => {
            return item.title;
        });
    });

    const chapters = computed(() => {
        return jArticle[novel.value].chapter.filter((c) => {
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
    <div class="content-widget" z-main>
        <div class="catalogue-shelf">
            <ul class="shelf-wrapper" :style="{ translate: curOrder.novel * -144 + `px` }">
                <li v-for="({ title, cover }, key, i) in jArticle">
                    <a
                        class="shelf-novel"
                        :class="{ checked: novel === key }"
                        @click="selectNovel(key, i)"
                        ><div class="shelf-cover">
                            <nuxt-img v-if="cover" :src="cover"/>
                            <div v-else class="shelf-placeholder">Cover.</div>
                        </div>
                        <span class="shelf-title">{{ title.split("-")[0] }}</span>
                    </a>
                </li>
            </ul>
        </div>
        <fieldset v-show="volumes.length" class="catalogue-volume">
            <legend class="content-h2">卷册列表</legend>
            <ul>
                <li v-for="(title, i) in volumes">
                    <a
                        :class="{ checked: curOrder.volume === i }"
                        @click="selectVolume(i)"
                    >{{ title }}</a>
                </li>
            </ul>
        </fieldset>
        <fieldset v-show="chapters.length" class="catalogue-chapter">
            <legend class="content-h2">章节列表</legend>
            <ul>
                <li v-for="chapter in chapters">
                    <nuxt-link :to="{ name: `reader`, params: { novel, index: chapter.index }}">
                        <span class="title">{{ chapter.title }}</span>
                        <time class="date">{{ chapter.refactored ?? chapter.date ?? "很久以前" }}</time>
                    </nuxt-link>
                </li>
            </ul>
        </fieldset>
    </div>
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
        color: var(--color-gray);
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

    :where(.catalogue-volume, .catalogue-chapter) {
        padding: 8px 16px 16px;
        border: 1px solid var(--color-border);
        border-radius: 4px;

        > legend {
            padding-inline: 8px;
        }

        li {
            display: flex;
            border: 1px solid transparent;
            border-radius: 4px;

            &:hover {
                border-color: var(--color-theme-dark);
            }
        }

        a {
            flex: 1;
            padding-inline: 8px;
            line-height: 32px;

            &.checked {
                color: var(--color-theme-text);
            }
        }
    }

    .catalogue-volume > ul {
        display: grid;
        grid: auto / repeat(auto-fit, minmax(min(144px, 100%), 1fr));
        text-align: center;
    }

    .catalogue-chapter {
        margin-top: 16px;

        a {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 8px;

            .date {
                font-size: 14px;
                color: var(--color-gray);
            }
        }
    }
</style>