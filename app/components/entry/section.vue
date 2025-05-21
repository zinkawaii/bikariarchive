<script lang="ts" setup>
    defineProps<{
        title?: string;
    }>();
</script>

<template>
    <section class="entry-section">
        <h2 v-if="title" :id="title">{{ title }}</h2>
        <slot>
            <div class="novel-text">
                <p>未知。</p>
            </div>
        </slot>
    </section>
</template>
