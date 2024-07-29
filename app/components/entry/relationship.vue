<script lang="ts" setup>
    import type { EntryRelationship } from "@bikari/process";

    defineProps<{
        data?: EntryRelationship[];
    }>();
</script>

<template>
    <entry-section class="entry-relationship" title="人际关系">
        <template v-if="data?.length">
            <template v-for="item in data">
                <hgroup>
                    <h3><character-tag :name="item.name"/></h3>
                    <span>：{{ item.relation }}</span>
                </hgroup>
                <div class="novel-text" v-html="item.content"></div>
            </template>
        </template>
        <p v-else>未知。</p>
    </entry-section>
</template>