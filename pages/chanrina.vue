<script setup>
    import jChanrina from "~/assets/json/Chanrina.json";
</script>

<template>
    <div class="content-widget" z-main>
        <div class="navbox-wrapper">
            <table class="chanrina-table">
                <tbody>
                    <tr>
                        <th>姓名</th>
                        <th>日文名</th>
                        <th>萌点</th>
                        <th>番剧</th>
                        <th width="96px">上映时间</th>
                        <th width="32px"><i class="fas fa-link"></i></th>
                    </tr>
                    <tr v-for="{ name, special, link, bangumi, date } in jChanrina.characters">
                        <td>{{ name.zh }}</td>
                        <td>{{ name.jp }}</td>
                        <td>{{ special.join("、") || "--" }}</td>
                        <td>{{ bangumi }}</td>
                        <td>{{ date }}</td>
                        <td><nuxt-link v-if="link" :to="link" target="_blank"><i class="fas fa-arrow-up-right-from-square"></i></nuxt-link></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .chanrina-table {
        min-width: 720px;
        font-size: 14px;
        text-align: center;
    }
</style>