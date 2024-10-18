<script lang="ts" setup>
    import dayjs from "dayjs";

    useHead({
        title: "阅读记录"
    });

    const page = ref(1);

    const { execute, data } = useLazyFetch("/api/read-record", {
        query: {
            page
        }
    });

    const records = ref<(typeof data.value)["list"]>();
    watchImmediate(data, (val) => {
        records.value = val?.list ?? [];
    });

    async function remove(item: any, i: number) {
        await $fetch("/api/read-record", {
            method: "delete",
            body: {
                id: item._id
            }
        });

        records.value.splice(i, 1);
        if (records.value.length) {
            return;
        }

        const { total, sizes } = data.value;
        const totalPages = Math.max(1, Math.ceil(total / sizes));
        if (page.value === totalPages && page.value > 1) {
            page.value -= 1;
        }
        else {
            execute();
        }
    }

    function formatTime(time: string) {
        return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    }
</script>

<template>
    <div class="manage-table-wrapper">
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
                <tr v-for="(item, i) in records" :key="item._id">
                    <th>{{ i + 1 }}</th>
                    <td>{{ item.ip }}</td>
                    <td>{{ formatTime(item.time) }}</td>
                    <td>{{ item.novel }}</td>
                    <td>{{ item.index }}</td>
                    <td>{{ item.user?.uid || "--" }}</td>
                    <td class="manage-operators">
                        <mb-button>
                            <iconify name="fa6-solid:pencil"/>
                        </mb-button>
                        <mb-button @click="remove(item, i)">
                            <iconify name="fa6-solid:trash-can"/>
                        </mb-button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="content-widget manage-pagination">
        <mb-pagination :total="data.total" :sizes="data.sizes" v-model="page"/>
    </div>
</template>

<style lang="scss" scoped>
    .manage-operators {
        text-wrap: nowrap;

        > .mb-button {
            width: 24px;
            aspect-ratio: 1;
            padding: 0;
        }
    }

    .manage-pagination {
        padding-block: 16px;
        border-block: none;
    }
</style>