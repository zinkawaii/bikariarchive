<script lang="ts" setup>
    import jAbility from "~/assets/json/Ability.json";

    const props = defineProps<{
        classification?: string;
        star?: number;
    }>();

    const filterred = jAbility.items.filter((item) => {
        const { classification, star } = props;
        if (classification) {
            return item.class.includes(classification);
        }
        else if (star !== void 0) {
            return item.owner[0]?.star === star;
        }
        return true;
    });
</script>

<template>
    <ul v-if="filterred.length" class="entry-known-ability">
        <li v-for="{ name, owner } in filterred">
            <entry-link :title="[owner[0]?.name ?? name, name]"/>
        </li>
    </ul>
    <p v-else>暂无。</p>
</template>

<style lang="scss" scoped>
    .entry-known-ability {
        padding-left: 2em;
        font-size: 14px;
        line-height: 26px;
        list-style-type: disc;
    }
</style>