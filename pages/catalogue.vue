<script setup>
    import jArticle from "~/dist/json/Article.json";

    useHead({
        title: "目录"
    });

    const current = ref({
        novel: "bikari",
        volOrder: 0
    });

    const volumes = computed(() => {
        const { novel } = current.value;
        return jArticle[novel].volume.map((item) => {
            return item.title;
        });
    });

    const chapters = computed(() => {
        return jArticle[current.value.novel].chapter.filter((c) => {
            return current.value.volOrder === c.volume;
        });
    });

    function selectNovel(key) {
        current.value.novel = key;
        current.value.volOrder = 0;
    }

    function selectVolume(volOrder) {
        current.value.volOrder = volOrder;
    }
</script>

<template>
    <div class="content-group">
        <div class="catalogue-wrapper">
            <fieldset class="catalogue-novel">
                <legend class="content-h2">书单</legend>
                <ul>
                    <li v-for="(novel, key) in jArticle">
                        <a :class="{
                            checked: current.novel === key
                        }"
                        @click="selectNovel(key)"
                        >{{ novel.title.split("-")[0] }}</a>
                    </li>
                </ul>
            </fieldset>
            <fieldset class="catalogue-volume">
                <legend class="content-h2">卷册列表</legend>
                <ul>
                    <li v-for="(volume, volOrder) in volumes">
                        <a :class="{
                            checked: current.volOrder === volOrder
                        }"
                        @click="selectVolume(volOrder)"
                        >{{ volume }}</a>
                    </li>
                </ul>
            </fieldset>
            <fieldset class="catalogue-chapter" :hidden="chapters.length === 0">
                <legend class="content-h2">章节列表</legend>
                <ul>
                    <li v-for="chapter in chapters">
                        <nuxt-link :to="{ name: `reader`, params: { novel: current.novel, index: chapter.index }}">
                            <span class="title">{{ chapter.title }}</span>
                            <span class="date">{{ chapter.date_reco ?? chapter.date ?? "很久以前" }}</span>
                        </nuxt-link>
                    </li>
                </ul>
            </fieldset>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .catalogue-wrapper {
        display: grid;
        gap: 16px;
        grid-template:
            "A B"
            "C C" / auto 1fr;
    }

    .catalogue-novel,
    .catalogue-volume,
    .catalogue-chapter {
        padding: 8px 16px 16px;
        border: 1px solid var(--color-border);
        border-radius: 4px;

        > legend {
            padding: 0 8px;
        }

        li {
            display: flex;
            justify-content: center;
            border: 1px solid transparent;
            border-radius: 4px;
            text-align: center;

            &:hover {
                border-color: var(--color-theme-block-dark);
            }
        }

        a {
            flex: 1;
            color: var(--color-text);

            &.checked {
                color: var(--color-theme-text);
            }
        }
    }

    .catalogue-novel {
        display: flex;
        flex-direction: column;
        width: 144px;

        a {
            position: relative;
            line-height: 36px;

            &.checked {
                &::before {
                    content: "《";
                    position: absolute;
                    left: 0;
                }

                &::after {
                    content: "》";
                    position: absolute;
                    right: 0;
                }
            }
        }
    }

    .catalogue-volume {
        flex: 1;

        > ul {
            display: grid;
            grid: auto / repeat(auto-fit, minmax(min(144px, 100%), 1fr));

            > li {
                line-height: 26px;
                white-space: nowrap;

                > a {
                    padding: 0 8px;
                }
            }
        }
    }

    .catalogue-chapter {
        grid-area: C;

        a {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            padding: 0 8px;
            line-height: 32px;
            color: var(--color-text);

            .title {
                flex: 1;
                text-align: left;
            }

            .date {
                font-size: 14px;
                color: var(--color-gray);
            }
        }
    }
</style>