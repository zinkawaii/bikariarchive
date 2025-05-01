<script lang="ts" setup>
    useHead({
        title: "更新日志",
    });

    const totalYears = [2025, 2024, 2023];

    const currentYear = useRouteQuery("year", 2025, {
        transform: Number,
    });

    const currentYearIdx = computed(() => {
        return totalYears.indexOf(currentYear.value);
    });

    const { status, data } = useLazyFetch("/api/update", {
        query: {
            year: currentYear,
        },
    });

    const { page, total, sizes, paginatedArr } = usePagination(() => data.value?.list ?? [], {
        sizes: 24,
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
        <mb-skeleton v-if="status === `pending`" class="update-skeleton"/>
        <ul v-else class="update-list">
            <li v-for="{ date, version, items } in paginatedArr" class="update-item">
                <div class="update-title">
                    <h2><time>{{ date }}</time></h2>
                    <code v-if="version" class="update-version">v{{ version }}</code>
                </div>
                <div class="update-content">
                    <p v-for="{ type, scope, content } in items" class="p-small">
                        <span class="update-type">{{ type }}</span>
                        <span v-if="scope" class="update-scope">{{ scope }}</span>
                        <novel-article as="span" :body="content"/>
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
        width: 36px;
        height: 16px;
        border-radius: 16px 32px 64px 24px / 16px 16px 24px 32px;
        background-image: linear-gradient(to right, var(--color-theme-dark), transparent);
        transition: translate 0.25s;
    }

    .update-skeleton {
        margin-block: var(--meow-medium);
    }

    .update-list {
        margin-block: 1rem;
        padding-left: 2rem;

        @include viewport("xs") {
            padding-left: 1.5rem;
        }
    }

    .update-item {
        position: relative;
        padding-block: 0.75rem;

        &::before {
            content: "";
            position: absolute;
            top: 0;
            width: 2px;
            height: 100%;
            background-image: linear-gradient(var(--color-theme-dark) 18px, transparent 0, transparent 30px, var(--color-theme-dark) 0);
            translate: -18px;
        }

        &::after {
            content: "";
            position: absolute;
            top: 17px;
            width: 14px;
            aspect-ratio: 1;
            border: 2px solid var(--color-theme-dark);
            border-radius: var(--bounded-full);
            translate: -24px;
        }
    }

    .update-title {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        padding-left: 0.5rem;
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

        @include dark {
            --shadow: 18%;
        }
    }

    .update-type {
        margin-right: 4px;
        font-family: var(--font-consolas);
        color: var(--color-theme-text);

        &::before {
            content: "(";
            color: var(--color-info);
        }

        &::after {
            content: ")";
            color: var(--color-info);
        }
    }

    .update-scope {
        margin-right: 4px;
        font-family: var(--font-consolas);
        color: var(--color-info);

        &::after {
            content: ":";
        }
    }
</style>
