<script lang="ts" setup>
    import jChanrina from "~/assets/json/Chanrina.json";

    useHead({
        title: "神殿"
    });
</script>

<template>
    <coco-widget title="神殿">
        <coco-table class="text-small text-center" :min-width="720">
            <tbody>
                <tr>
                    <th>姓名</th>
                    <th>日文名</th>
                    <th>萌点</th>
                    <th>番剧</th>
                    <th width="96px">上映时间</th>
                    <th width="32px"><icon name="fa6-solid:link"/></th>
                </tr>
                <tr v-for="{ name, special, link, bangumi, date } in jChanrina.characters">
                    <td>{{ name.zh }}</td>
                    <td>{{ name.jp }}</td>
                    <td>{{ special.join("、") || "--" }}</td>
                    <td>{{ bangumi }}</td>
                    <td>{{ date }}</td>
                    <td><nuxt-link v-if="link" :to="link" target="_blank"><icon name="fa6-solid:arrow-up-right-from-square"/></nuxt-link></td>
                </tr>
            </tbody>
        </coco-table>
    </coco-widget>
</template>