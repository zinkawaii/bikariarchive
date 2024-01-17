<script setup>
    import jUpdate from "~/assets/json/Update.json";

    useHead({
        title: "更新日志"
    });
</script>

<template>
    <coco-widget title="更新日志">
        <ul class="update-list">
            <li v-for="{ date, version, content } in jUpdate" class="update-item">
                <div class="update-title">
                    <h2><time>{{ date }}</time></h2>
                    <code v-if="version" class="update-version">v{{ version }}</code>
                </div>
                <div class="update-content">
                    <p v-for="(text, i) in content" class="p-small">
                        <span>{{ i + 1 }}. </span>
                        <span v-html="text"></span>
                    </p>
                </div>
            </li>
        </ul>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .update-list {
        display: grid;
        gap: 1em;
        margin-left: 1em;
        padding-left: 1em;
        border-left: 2px solid var(--color-theme-dark);

        @media (width < 425px) {
            margin-left: 0.5em;
        }
    }

    .update-title {
        display: flex;
        align-items: center;
        gap: 0.5em;
        position: relative;
        padding-left: 0.5em;
        line-height: 3em;

        &::before {
            content: "";
            position: absolute;
            width: 14px;
            aspect-ratio: 1;
            margin-block: auto;
            border: 2px solid var(--color-theme-dark);
            border-radius: var(--circle-radius);
            background-color: var(--color-background);
            translate: -2em;
        }
    }

    .update-version {
        font-size: 14px;
        line-height: 20px;
    }

    .update-content {
        --shadow: 6%;

        padding: 0.8em 1em;
        border-radius: 1.5em;
        box-shadow: 6px 6px rgb(0 0 0 / var(--shadow));
        background-color: var(--color-background);

        [z-dark] & {
            --shadow: 18%;
        }
    }
</style>