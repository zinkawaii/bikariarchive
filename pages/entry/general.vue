<script setup>
    import { EntryKnownAbility } from "#components";

    const props = defineProps(["data"]);

    const components = {
        "known-ability": EntryKnownAbility
    };
</script>

<template>
    <div class="entry-header">
        <h1 id="Title">{{ data.title }}</h1>
    </div>
    <article class="entry-text">
        <div class="entry-block entry-main">
            <div class="left">
                <div id="Summary">
                    <p v-for="text in toSplit(data.summary)" v-html="text"></p>
                </div>
                <div v-if="data.info?.length > 0" class="div-table entry-brief">
                    <dl v-for="i in data.info?.length">
                        <template v-for="item in data.info[i - 1]">
                            <dt>{{ item[0] }}</dt>
                            <dd>{{ item[1] }}</dd>
                        </template>
                    </dl>
                </div>
            </div>
        </div>
        <div v-for="item in data.details" class="entry-block">
            <h2>{{ item.title }}</h2>
            <component v-if="item.component" :is="components[item.component]" v-bind="item.attrs"/>
            <template v-else>
                <p v-for="text in toSplit(item.content)" v-html="text"></p>
            </template>
        </div>
    </article>
</template>