<script setup>
    const props = defineProps({
        placeholder: String,
        viewable: {
            type: Boolean,
            default: false
        }
    });

    const imageViewerStore = useImageViewerStore();
    const $ = ref();

    function openViewer() {
        props.viewable && imageViewerStore.open($.value);
    }

    function loadPlaceholder(event) {
        if (props.placeholder) {
            event.target.src = props.placeholder;
        }
    }
</script>

<template>
    <img ref="$" class="mb-image" :class="{ [`cursor-pointer`]: viewable }" @click="openViewer" @error.once="loadPlaceholder"/>
</template>