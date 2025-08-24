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
        <meow-table class="gallery-illustrator" variant="div">
            <dl>
                <dt>画师</dt>
                <dd>{{ illustrator }}</dd>
            </dl>
        </meow-table>
    </div>
</template>

<style lang="scss" scoped>
    .gallery-illustration {
        display: grid;
        gap: 8px;

        :deep(> .mb-image) {
            margin-block: 0;
        }
    }

    .gallery-illustrator {
        --dt-fr: 0.6fr;

        margin-top: 8px;
        text-align: center;
    }
</style>
