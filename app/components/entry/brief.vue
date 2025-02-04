<script lang="ts" setup>
    import type { EntryBrief } from "@bikari/article";

    const props = defineProps<EntryBrief>();

    const fields = computed(() => [
        [
            { key: "中文名", val: props.name?.zh },
            { key: "外文名", val: props.name?.en },
            { key: "性别", val: props.sex }
        ],
        [
            { key: "日文名", val: props.name?.jp },
            { key: "振假名", val: props.name?.ka },
            { key: "年龄", val: props.age }
        ]
    ]);
</script>

<template>
    <div class="div-table entry-brief">
        <dl v-for="arr in fields">
            <template v-for="{ key, val } in arr">
                <template v-if="val !== void 0">
                    <dt>{{ key }}</dt>
                    <dd>{{ val }}</dd>
                </template>
            </template>
        </dl>
    </div>
</template>

<style lang="scss" scoped>
    .entry-brief {
        --dt-fr: 0.3fr;
        --dd-fr: 0.7fr;

        margin-top: 8px;

        @container entry-main (width < 512px) {
            flex-direction: column;
        }
    }
</style>