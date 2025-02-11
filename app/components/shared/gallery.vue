<script lang="ts" setup>
    defineProps<{
        illustrator: string;
    }>();
</script>

<template>
    <div class="mb-gallery">
        <div class="gallery-illustration">
            <slot></slot>
        </div>
        <div class="gallery-illustrator div-table">
            <dl>
                <dt>画师</dt>
                <dd>{{ illustrator }}</dd>
            </dl>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .gallery-illustration {
        display: grid;
        grid-gap: 8px;

        :deep(> .mb-image) {
            margin-block: 0;
        }
    }

    .gallery-illustrator {
        --dt-fr: 0.6fr;
        --font-size-th: 1rem;
        --font-size-td: 1rem;

        margin-top: 8px;
        text-align: center;
    }
</style>