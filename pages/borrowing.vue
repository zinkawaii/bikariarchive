<script setup>
    import jBorrowing from "~/assets/json/Borrowing.json";

    useHead({
        title: "借物表"
    });
</script>

<template>
    <coco-widget title="借物表">
        <coco-table class="borrowing-table">
            <tbody>
                <tr>
                    <th width="25%">元素</th>
                    <th width="50%">出处</th>
                    <th>创作者</th>
                </tr>
                <template v-for="element in jBorrowing.list">
                    <tr v-for="(item, i) in element.items">
                        <th v-if="i === 0" :rowspan="element.items.length">{{ element.title }}</th>
                        <td><plain-link :to="item.src.link" target="_blank">{{ item.src.name }}</plain-link></td>
                        <td><plain-link :to="item.creator.link" target="_blank">{{ item.creator.name }}</plain-link></td>
                    </tr>
                </template>
            </tbody>
        </coco-table>
        <p class="borrowing-tip">* 除本借物表所标注的素材外，其余所有（底部或含有画师标签的）图片均为《微光茶馆》及其衍生作品的原创稿件。</p>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .borrowing-tip {
        margin-top: 2px;
        font-size: 14px;
        line-height: 24px;
        color: var(--color-text-info);
    }
</style>