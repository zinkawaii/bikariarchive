<script setup>
    import jAbility from "~/assets/json/Ability.json";

    const props = defineProps({
        classification: String
    });

    const filterList = jAbility.items.filter((item) => {
        return item.class.includes(props.classification);
    });
</script>

<template>
    <ul v-if="filterList.length > 0" class="entry-known-ability">
        <li v-for="{ name, owner } in filterList">
            <nuxt-link v-if="owner.length > 0" :to="toEntry(owner[0].name)">{{ name }}</nuxt-link>
            <span v-else>{{ name }}</span>
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