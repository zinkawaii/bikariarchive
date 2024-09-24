<script lang="ts" setup>
    import dayjs from "dayjs";
    import type { UnwrapRef } from "vue";

    useHead({
        title: "阅读记录"
    });

    //查询方式
    const mode = ref(0);
    const que = ref([
        {
            title: "最近",
            count: 20
        },
        {
            title: "最初",
            count: 20
        }
    ]);

    //查询范围
    const from = ref(0);
    const to = ref(0);

    //请求
    const { execute, data } = useLazyFetch("/api/read-record", {
        query: {
            from,
            to
        },
        immediate: false,
        watch: false
    });

    //数据
    const records = ref<UnwrapRef<typeof data>["data"]>([]);
    watch(data, ({ data }) => {
        records.value = from.value < 0 ? data.toReversed() : data;
    });

    //查询
    async function query() {
        const { count } = que.value[mode.value];
        [from.value, to.value] = {
            0: [-count, 0],
            1: [0, count]
        }[mode.value];

        execute();
    }

    //清空
    function clear() {
        records.value.length = 0;
    }

    //编辑
    function edit(item: any) {}

    //删除
    async function remove(item: any, i: number) {
        await $fetch("/api/read-record", {
            method: "delete",
            body: {
                id: item._id
            }
        });
        records.value.splice(i, 1);
    }

    //时间格式化
    function formatTime(time: string) {
        return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    }
</script>

<template>
    <coco-widget>
        <div class="manage-grid">
            <div v-for="(item, i) in que">
                <form class="manage-form" :name="item.title">
                    <span class="manage-title">{{ item.title }}</span>
                    <input class="manage-input" type="number" v-model="item.count"/>
                    <span>条</span>
                </form>
                <div class="manage-cursor" :class="{ active: mode === i }" @click="mode = i"></div>
            </div>
        </div>
        <mb-button @click="query">查询</mb-button>
        <mb-button :disabled="!records.length" @click="clear">清空</mb-button>
    </coco-widget>
    <div class="manage-table-wrapper" :hidden="!records.length">
        <table class="manage-table">
            <tbody>
                <tr>
                    <th width="60px">序号</th>
                    <th>IP</th>
                    <th width="176px">时间</th>
                    <th width="96px">小说</th>
                    <th width="96px">章节</th>
                    <th width="96px">用户</th>
                    <th width="1%">操作</th>
                </tr>
                <transition-group>
                    <tr v-for="(item, i) in records" :key="item._id">
                        <th>{{ i + 1 }}</th>
                        <td>{{ item.ip }}</td>
                        <td>{{ formatTime(item.time) }}</td>
                        <td>{{ item.novel }}</td>
                        <td>{{ item.index }}</td>
                        <td>{{ item.user?.uid || "--" }}</td>
                        <td class="manage-operators">
                            <mb-button @click="edit(item)">
                                <iconify name="fa6-solid:pencil"/>
                            </mb-button>
                            <mb-button @click="remove(item, i)">
                                <iconify name="fa6-solid:trash-can"/>
                            </mb-button>
                        </td>
                    </tr>
                </transition-group>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
    .manage-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    .manage-form {
        display: flex;
        align-items: center;
        gap: 1em;
        height: 36px;
        margin-block: 1em;
        padding-inline: 1em;
        border: 1px solid var(--color-border-light);
        border-radius: 8px;
        background-color: var(--color-background);
        font-size: 14px;
    }

    .manage-title {
        padding-right: 1em;
        border-right: 1px solid var(--color-border-light);
    }

    .manage-input {
        flex: 1;
        width: 0;
        height: 100%;
        border: 0;
        background-color: transparent;
        text-align: center;
    }

    .manage-cursor {
        --bg: var(--color-background);

        margin: -8px 0 8px;
        padding-block: 8px;
        cursor: pointer;

        &::after {
            content: "";
            display: block;
            height: 6px;
            border-radius: 3px;
            box-shadow: 2px 2px 0 var(--color-border-lighter);
            background-color: var(--bg);
        }

        &.active {
            --bg: var(--color-theme);
        }
    }

    .manage-operators {
        text-wrap: nowrap;

        > .mb-button {
            width: 24px;
            aspect-ratio: 1;
            padding: 0;
        }
    }
</style>