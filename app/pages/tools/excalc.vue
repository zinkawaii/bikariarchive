<script lang="ts" setup>
    import type { EXCalcBuki, EXCalcData } from "~/types/excalc";

    useHead({
        title: "西北风计算器"
    });

    //本地数据
    const storage = useLocalStorage<EXCalcData[]>("excalc-data", []);

    //空数据填充
    whenever(() => !storage.value.length, () => {
        storage.value.push(createData());
    }, {
        immediate: true
    });

    //数据集合
    const currentIdx = ref(0);
    const state = computed(() => {
        return storage.value[currentIdx.value];
    });

    //创建数据
    function createData(): EXCalcData {
        return {
            name: "空参数",
            main: [0, 0, 0],
            pioneer: [0, 0, 0],
            time: 0,
            health: 0,
            times: 0,
            bukis: [createBuki()]
        };
    }

    //创建武器
    function createBuki(): EXCalcBuki {
        return {
            name: "",
            damage: 0,
            hit: 0,
            accuracyRate: 100,
            critRate: 0,
            critDamage: 150
        };
    }

    //添加数据
    function addData() {
        storage.value.push(createData());
        currentIdx.value = storage.value.length - 1;
    }

    //删除数据
    async function removeData() {
        if (await Zin.confirm(`是否删除当前数据：${state.value.name}？`)) {
            storage.value.splice(currentIdx.value, 1);
            currentIdx.value = Math.max(0, storage.value.length - 1);
        }
    }

    //添加武器
    function addBuki() {
        state.value.bukis.push(createBuki());
    }

    //删除武器
    function removeBuki(index: number) {
        state.value.bukis.splice(index, 1);
    }

    //斩杀率
    const killRate = ref(0);

    //分数
    const score = computed(() => {
        const powers = Math.max(
            state.value.main.reduce((prev, ship) => {
                return prev + ship;
            }, 0) +
            state.value.pioneer.reduce((prev, ship) => {
                return prev + ship;
            }, 0),
            0
        );
        return Math.floor((5000 / (state.value.time + 50) ** 0.36 - powers ** 0.6) * 10);
    });

    //开凹
    async function roll() {
        const { roll } = await import("@bikari/excalc");
        killRate.value = roll(state.value);
    }
</script>

<template>
    <coco-widget>
        <div class="excalc-top">
            <div class="excalc-power">
                <div class="excalc-param">
                    <div class="excalc-label">
                        <span>参数</span>
                        <mb-select class="excalc-param-selector" v-model="currentIdx">
                            <mb-option v-for="(data, i) in storage" :title="`[${i + 1}] ${data.name}`" :value="i"/>
                        </mb-select>
                    </div>
                    <div class="excalc-param-handler">
                        <mb-button @click="addData">添加</mb-button>
                        <mb-button @click="removeData">删除</mb-button>
                    </div>
                </div>
                <div class="excalc-label">
                    <span>标题</span>
                    <mb-input v-model="state.name"/>
                </div>
                <div class="excalc-label">
                    <span>后排</span>
                    <mb-input-number v-for="(item, i) in state.main" v-model="state.main[i]"/>
                </div>
                <div class="excalc-label">
                    <span>前排</span>
                    <mb-input-number v-for="(item, i) in state.pioneer" v-model="state.pioneer[i]"/>
                </div>
            </div>
            <div class="excalc-main">
                <label class="excalc-label">
                    <span>血量</span>
                    <mb-input-number v-model="state.health"/>
                </label>
                <label class="excalc-label">
                    <span>次数</span>
                    <mb-input-number v-model="state.times"/>
                </label>
                <mb-button full @click="roll">Roll</mb-button>
                <label class="excalc-label">
                    <span>斩杀率</span>
                    <mb-input-number :accuracy="7" readonly trim v-model="killRate"/>
                </label>
                <div class="excalc-division"></div>
                <label class="excalc-label">
                    <span>时间</span>
                    <mb-input-number v-model="state.time"/>
                </label>
                <label class="excalc-label">
                    <span>分数</span>
                    <mb-input-number readonly v-model="score"/>
                </label>
            </div>
        </div>
        <div class="excalc-bottom">
            <div class="excalc-tools">
                <mb-button @click="addBuki">添加武器</mb-button>
            </div>
            <coco-table class="excalc-table">
                <tbody>
                    <tr>
                        <th>武器名称</th>
                        <th>伤害</th>
                        <th>Hit</th>
                        <th>命中率</th>
                        <th>暴击率</th>
                        <th>暴击伤害</th>
                        <th>其他</th>
                    </tr>
                    <tr v-for="(item, i) in state.bukis">
                        <td><mb-input v-model="item.name"/></td>
                        <td><mb-input-number v-model="item.damage"/></td>
                        <td><mb-input-number v-model="item.hit"/></td>
                        <td><mb-input-number :accuracy="2" v-model="item.accuracyRate"/></td>
                        <td><mb-input-number :accuracy="2" v-model="item.critRate"/></td>
                        <td><mb-input-number :accuracy="2" v-model="item.critDamage"/></td>
                        <td><mb-button class="excalc-delete" :disabled="state.bukis.length <= 1" @click="removeBuki(i)">删除</mb-button></td>
                    </tr>
                </tbody>
            </coco-table>
        </div>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .excalc-top {
        display: flex;
        justify-content: space-between;
        gap: 32px;

        @include viewport("sm") {
            flex-direction: column;
            gap: 16px;
        }
    }

    .excalc-power {
        display: grid;
        align-content: flex-start;
        gap: 16px;

        @include viewport(">sm") {
            max-width: 512px;
        }
    }

    .excalc-label {
        display: flex;
        align-items: center;
        gap: 16px;

        > .mb-input {
            flex: 1;
        }
    }

    .excalc-param {
        display: grid;
        gap: 16px;

        @include viewport(">sm") {
            grid-template-columns: 1fr auto;
        }
    }

    .excalc-param-selector {
        flex: 1;
    }

    .excalc-param-handler {
        @include viewport("sm") {
            margin-left: 48px;
        }
    }

    .excalc-main {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .excalc-division {
        height: 1px;
        margin-block: 8px;
        background-color: var(--color-border);
    }

    .excalc-bottom {
        display: grid;
        gap: 16px;
        margin-top: -30px;

        @include viewport("sm") {
            margin-top: 16px;
        }
    }

    .excalc-tools {
        pointer-events: none;

        > .mb-button {
            pointer-events: auto;
        }
    }

    .excalc-table {
        td {
            padding-block: 4px;
        }
    }
</style>