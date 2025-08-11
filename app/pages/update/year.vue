<script lang="ts" setup>
    const { year } = defineProps<{
        year: number;
    }>();

    const { status, data } = useFetch("/api/update", {
        query: {
            year,
        },
    });

    const { page, total, sizes, paginatedList } = usePagination(() => data.value?.list ?? [], {
        sizes: 24,
    });
</script>

<template>
    <mb-skeleton v-if="status !== `success`" class="update-skeleton"/>
    <ul v-else class="update-list">
        <li v-for="{ date, version, items } in paginatedList" class="update-item">
            <hgroup class="update-title">
                <h2><time>{{ date }}</time></h2>
                <code v-if="version" class="update-version">v{{ version }}</code>
            </hgroup>
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
</template>

<style lang="scss" scoped>
    .update-skeleton {
        margin-block: var(--meow-medium);
    }

    .update-list {
        margin-block: 16px;
        padding-left: 32px;

        @include viewport("xs") {
            padding-left: 24px;
        }
    }

    .update-item {
        position: relative;
        padding-block: 12px;

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
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        padding-left: 8px;
    }

    .update-version {
        line-height: 1.4;
    }

    .update-content {
        --shadow: 6%;

        padding: 12px 16px;
        border-radius: 24px;
        box-shadow: 6px 6px rgb(0 0 0 / var(--shadow));
        background-color: var(--color-background);

        @include dark {
            --shadow: 18%;
        }
    }

    .update-type {
        margin-right: 4px;
        font-family: var(--font-monospace);
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
        font-family: var(--font-monospace);
        color: var(--color-info);

        &::after {
            content: ":";
        }
    }
</style>
