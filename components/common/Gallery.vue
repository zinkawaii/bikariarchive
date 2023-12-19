<script setup>
    const props = defineProps({
        illustrator: {
            type: String,
            required: true
        }
    });
</script>

<template>
    <div class="mb-gallery">
        <div class="gallery-illustration">
            <slot></slot>
        </div>
        <div class="div-table gallery-illustrator">
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
        grid-gap: 16px;
    }

    .gallery-illustrator {
        --dt-fr: 0.6fr;

        margin-top: 8px;
        font-size: 1rem;
        text-align: center;
    }
</style>