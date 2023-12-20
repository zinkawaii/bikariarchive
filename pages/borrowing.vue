<script setup>
    import jBorrowing from "~/assets/json/Borrowing.json";

    useHead({
        title: "借物表"
    });
</script>

<template>
    <div class="content-widget" z-main>
        <p class="p-small text-gray borrowing-tip">* 除本借物表所标注的素材外，其余所有（底部或含有画师标签的）图片均为《微光茶馆》及其衍生作品的原创稿件。</p>
        <table class="navbox-table">
            <tbody>
                <tr>
                    <th width="25%">元素</th>
                    <th width="50%">出处</th>
                    <th>创作者</th>
                </tr>
                <template v-for="element in jBorrowing.list">
                    <tr v-for="(item, i) in element.items">
                        <th v-if="i === 0" :rowspan="element.items.length">{{ element.title }}</th>
                        <td><coco-link :to="item.src.link" target="_blank">{{ item.src.name }}</coco-link></td>
                        <td><coco-link :to="item.creator.link" target="_blank">{{ item.creator.name }}</coco-link></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
    @media (width >= 1024px) {
        .borrowing-tip {
            margin-top: -16px;
        }
    }
</style>