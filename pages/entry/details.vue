<script setup>
    const props = defineProps(["title", "category", "data"]);
</script>

<template>
    <div class="detail-header">
        <h1 id="Title">{{ data.title }}</h1>
    </div>
    <article class="detail-text">
        <div class="detail-block detail-main">
            <div class="left">
                <div id="Summary">
                    <p v-for="text in toSplit(data.summary)" v-html="text"></p>
                </div>
                <div class="div-table detail-brief">
                    <dl v-for="i in data.info?.length">
                        <template v-for="item in data.info[i - 1]">
                            <dt>{{ item[0] }}</dt>
                            <dd>{{ item[1] }}</dd>
                        </template>
                    </dl>
                </div>
            </div>
        </div>
        <div v-for="item in data.details" class="detail-block">
            <h2>{{ item.title }}</h2>
            <p v-for="text in toSplit(item.content)" v-html="text"></p>
        </div>
    </article>
</template>