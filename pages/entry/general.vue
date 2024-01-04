<script setup>
    import { EntryKnownAbility } from "#components";

    const props = defineProps(["data"]);

    const components = {
        "known-ability": EntryKnownAbility
    };
</script>

<template>
    <header class="entry-header">
        <h1 class="entry-title">{{ data.title }}</h1>
    </header>
    <article class="entry-article">
        <section class="entry-section entry-main">
            <div class="left">
                <div class="entry-summary">
                    <p v-for="text in splitByNewline(data.summary)" v-html="text"></p>
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
        </section>
        <section v-for="item in data.details" class="entry-section">
            <h2>{{ item.title }}</h2>
            <component v-if="item.component" :is="components[item.component]" v-bind="item.attrs"/>
            <template v-else>
                <p v-for="text in splitByNewline(item.content)" v-html="text"></p>
            </template>
        </section>
    </article>
</template>