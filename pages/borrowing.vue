<script setup>
    import jBorrowing from "~/assets/json/Borrowing.json";

    useHead({
        title: "借物表"
    });
</script>

<template>
    <div class="content-group">
        <p class="p-small text-gray borrowing-tip">* 除本借物表所标注的素材外，其余所有（底部或含有画师标签的）图片均为《微光茶馆》及其衍生作品的原创稿件。</p>
        <table class="navbox-table">
            <tbody>
                <tr>
                    <th width="25%">元素</th>
                    <th width="50%">出处</th>
                    <th>创作者</th>
                </tr>
                <template v-for="(element, i) in jBorrowing.list">
                    <tr v-for="(item, j) in element.items">
                        <th v-if="j === 0" :rowspan="element.items.length" :class="`navbox-ceil-${i % 2 === 0 ? 'odd' : 'even'}`">{{ element.title }}</th>
                        <td><nuxt-link :to="item.src.link" target="_blank">{{ item.src.name }}</nuxt-link></td>
                        <td><nuxt-link :to="item.creator.link" target="_blank">{{ item.creator.name }}</nuxt-link></td>
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