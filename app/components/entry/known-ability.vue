<script lang="ts" setup>
    import abilityJson from "#data/json/ability.json";

    const props = defineProps<{
        classification?: string;
        star?: number;
    }>();

    const filterred = abilityJson.filter((item) => {
        const { classification, star } = props;
        if (classification) {
            return item.class.includes(classification);
        }
        else if (star !== void 0) {
            return item.owners[0]?.star === star;
        }
        return true;
    });
</script>

<template>
    <p v-if="filterred.length" class="entry-known-ability">
        <entry-link
            v-for="{ name, owners } in filterred"
            :title="[owners[0]?.name ?? name, name]"
        />
    </p>
    <p v-else>暂无。</p>
</template>

<style lang="scss" scoped>
    .entry-known-ability {
        padding-left: 4px;
        font-size: 14px;
        text-indent: 0;
    }

    .entry-link {
        & + &::before {
            content: " • ";
        }
    }
</style>
