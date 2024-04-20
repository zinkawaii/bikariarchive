<script setup>
    import dayjs from "dayjs";

    useHead({
        title: "阅读记录"
    });

    //查询方式
    const que = ref({
        list: [
            {
                title: "最近",
                count: 20
            },
            {
                title: "最初",
                count: 20
            }
        ],
        current: 0,
        get title() {
            return this.list[this.current].title;
        },
        get count() {
            return this.list[this.current].count;
        }
    });

    //正在查询
    const querying = ref(false);

    //数据
    const data = ref([]);

    //范围查询
    async function exactQuery(from, to) {
        //开始查询
        querying.value = true;
        const res = await Zjax.get("/api/read-record", {
            query: {
                from,
                to
            }
        });

        //结束查询
        querying.value = false;
        return res;
    }

    //查询
    async function query() {
        const [from, to] = ((current) => {
            const count = que.value.list[current].count;
            return {
                0: [-count, 0],
                1: [0, count]
            }[current];
        })(que.value.current);

        const res = await exactQuery(from, to);
        data.value.length = 0;

        if (from < 0) {
            data.value.push(...res.data.reverse());
        }
        else {
            data.value.push(...res.data);
        }
    }

    //清空
    function clear() {
        data.value.length = 0;
    }

    //编辑
    function edit(item) {}

    //删除
    async function remove(item, index) {
        await Zjax.delete("/api/read-record", {
            body: {
                id: item._id
            }
        });
        data.value.splice(index, 1);
    }

    //时间格式化
    function formatTime(time) {
        return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
    }
</script>

<template>
    <coco-widget>
        <div class="manage-flex">
            <div v-for="item, index in que.list">
                <form class="manage-form" :name="item.title">
                    <span class="title">{{ item.title }}</span>
                    <input class="manage-input" type="number" v-model="item.count"/>
                    <span>条</span>
                </form>
                <div class="manage-cursor" :class="{ active: index === que.current }" @click="que.current = index"></div>
            </div>
        </div>
        <mb-button :disabled="querying" @click="query">查询</mb-button>
        <mb-button :disabled="!data.length" @click="clear">清空</mb-button>
    </coco-widget>
    <div class="manage-table-wrapper" :hidden="!data.length">
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
                    <tr v-for="item, index in data" :key="item._id">
                        <th>{{ index + 1 }}</th>
                        <td>{{ item.ip }}</td>
                        <td>{{ formatTime(item.time) }}</td>
                        <td>{{ item.novel }}</td>
                        <td>{{ item.index }}</td>
                        <td>{{ item.user?.uid || "--" }}</td>
                        <td class="manage-operators">
                            <mb-button @click="edit(item)">
                                <icon name="fa6-solid:pencil"/>
                            </mb-button>
                            <mb-button @click="remove(item, index)">
                                <icon name="fa6-solid:trash-can"/>
                            </mb-button>
                        </td>
                    </tr>
                </transition-group>
            </tbody>
        </table>
    </div>
</template>

<style lang="scss" scoped>
    .manage-flex {
        display: flex;
        gap: 16px;

        > div {
            flex: 1;
        }
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

        .title {
            padding-right: 1em;
            border-right: 1px solid var(--color-border-light);
        }
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

        > button {
            width: 24px;
            aspect-ratio: 1;
            padding: 0;
        }
    }
</style>