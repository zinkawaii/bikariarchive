<script lang="ts" setup>
    import jUpdate from "~/assets/json/Update.json";

    useHead({
        title: "更新日志"
    });

    const totalYears = [2024, 2023];
    const currentYearIdx = ref(0);

    const updates = computed(() => {
        const currentYear = totalYears[currentYearIdx.value].toString();
        return jUpdate.filter((item) => {
            return item.date.startsWith(currentYear);
        });
    });

    const { page, total, sizes, filteredArr } = usePagination(updates, {
        sizes: 24
    });
</script>

<template>
    <meow-widget title="更新日志">
        <div class="update-years">
            <div class="update-thumb" :style="{ translate: `${currentYearIdx * 88}px` }"></div>
            <a
                v-for="year, i in totalYears"
                class="update-year"
                :class="{ [`is-checked`]: totalYears[currentYearIdx] === year }"
                @click="currentYearIdx = i"
            >{{ year }}</a>
        </div>
        <ul class="update-list">
            <li v-for="{ date, version, content } in filteredArr" class="update-item">
                <div class="update-title">
                    <h2><time>{{ date }}</time></h2>
                    <code v-if="version" class="update-version">v{{ version }}</code>
                </div>
                <div class="update-content">
                    <p v-for="(text, i) in content" class="p-small">
                        <span>{{ i + 1 }}. </span>
                        <span v-html="text"></span>
                    </p>
                </div>
            </li>
        </ul>
        <mb-pagination :total :sizes scroll-target="body" v-model="page"/>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .update-years {
        display: flex;
        align-items: flex-end;
        gap: 0.5rem;
        position: relative;
        height: 2rem;
    }

    .update-year {
        position: relative;
        width: 72px;
        margin-left: 8px;
        font-family: var(--font-smooth);
        font-size: 28px;
        text-align: center;
        transition: all 0.25s;

        &:not(.is-checked) {
            opacity: 0.5;
            font-size: 24px;
        }
    }

    .update-thumb {
        position: absolute;
        bottom: 0;
        width: 36px;
        height: 16px;
        border-radius: 16px 32px 64px 24px / 16px 16px 24px 32px;
        background-image: linear-gradient(to right, var(--color-theme-dark), transparent);
        transition: all 0.25s;
    }

    .update-list {
        display: grid;
        gap: 1rem;
        margin: 1rem 0 var(--meow-medium) 1rem;
        padding-left: 1rem;
        border-left: 2px solid var(--color-theme-dark);

        @include viewport("xs") {
            margin-left: 0.5rem;
        }
    }

    .update-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        padding-left: 0.5rem;
        line-height: 3rem;

        &::before {
            content: "";
            position: absolute;
            width: 14px;
            aspect-ratio: 1;
            margin-block: auto;
            border: 2px solid var(--color-theme-dark);
            border-radius: var(--bounded-full);
            background-color: var(--color-background);
            translate: -2rem;
        }
    }

    .update-version {
        font-size: 14px;
        line-height: 20px;
    }

    .update-content {
        --shadow: 6%;

        padding: 0.8rem 1rem;
        border-radius: 1.5rem;
        box-shadow: 6px 6px rgb(0 0 0 / var(--shadow));
        background-color: var(--color-background);

        [z-dark] & {
            --shadow: 18%;
        }
    }
</style>