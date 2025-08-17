<script lang="ts" setup>
    useHead({
        title: "更新日志",
    });

    const config = useRuntimeConfig();
    const { totalYears } = config.public;

    const currentYear = useRouteParams("year", void 0, {
        transform: Number,
    });

    const currentYearIdx = computed(() => {
        return totalYears.indexOf(currentYear.value);
    });
</script>

<template>
    <meow-widget title="更新日志">
        <div class="update-years">
            <span v-if="currentYearIdx !== -1" class="update-thumb" :style="{ translate: `${currentYearIdx * 88}px` }"></span>
            <button
                v-for="year in totalYears"
                class="update-year"
                :class="{ [`is-checked`]: totalYears[currentYearIdx] === year }"
                @click="currentYear = year"
            >{{ year }}</button>
        </div>
        <nuxt-page :year="currentYear"/>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .update-years {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 32px;
    }

    .update-year {
        width: 72px;
        margin-left: 8px;
        font-family: var(--font-smooth);
        font-size: 28px;
        text-align: center;
        transition: all 0.25s;
        isolation: isolate;

        &:not(.is-checked) {
            opacity: 0.5;
            font-size: 24px;
        }
    }

    .update-thumb {
        position: absolute;
        width: 36px;
        height: 16px;
        border-radius: 16px 32px 64px 24px / 16px 16px 24px 32px;
        background-image: linear-gradient(to right, var(--color-theme-dark), transparent);
        transition: translate 0.25s;
    }
</style>
