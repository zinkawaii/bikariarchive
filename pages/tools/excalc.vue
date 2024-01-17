<script setup>
    useHead({
        title: "西北风计算器"
    });

    const confirmStore = useConfirmStore();

    //数据集合
    const state = ref();

    //斩杀率
    const kill_rate = ref(0);

    //武器模板
    const buki_template = {
        name: "",
        damage: 0,
        hit: 0,
        accuracy_rate: 100,
        crit_rate: 0,
        crit_damage: 150
    };

    //存储参数
    const key = "excalc-params";
    const params = {
        current: ref(),
        data: ref(JSON.parse(process.browser && localStorage.getItem(key))?.data || []),

        //保存
        async save() {
            if (await confirmStore.show(`是否将当前所有数据保存至本地？`)) {
                //保存至数据
                this.data.value[this.current.value] = {
                    ...state.value
                };

                //保存至本地
                this.save2Local();
            }
        },

        //添加
        async add() {
            if (await confirmStore.show("是否清空当前数据（若未保存）并新建一组数据？")) {
                //初始化
                const obj = this.init({ name: "新参数" });

                //保存至数据
                this.data.value.push(obj);

                //切换至新参数
                this.current.value = this.data.value.length - 1;
            }
        },

        //删除
        async remove() {
            if (await confirmStore.show(`是否删除「${state.value.name}」并清空当前数据？`)) {
                //删除
                this.data.value.splice(this.current.value, 1);

                //切换至上一参数
                const length = this.data.value.length;
                if (length > 0) {
                    this.current.value = Math.min(length - 1, this.current.value);
                    this.change();
                }
                else {
                    this.current.value = void(0);
                    this.init();
                }

                //保存至本地
                this.save2Local();
            }
        },

        //初始化
        init({ name = "" } = {}) {
            const obj = {
                name,
                power: {
                    main: [0, 0, 0],
                    pioneer: [0, 0, 0]
                },
                time: 0,
                health: 0,
                times: 0,
                buki: [
                    { ...buki_template }
                ]
            };
            state.value = obj;
            return obj;
        },

        //切换时
        change() {
            state.value = this.data.value[this.current.value];
        },

        //保存至本地
        save2Local() {
            localStorage.setItem(key, JSON.stringify({
                data: this.data.value
            }));
        }
    };

    //初始化
    params.init();

    //计算属性：分数
    const score = computed(() => {
        const powers =
            state.value.power.main.reduce((prev, ship) => {
                return prev += ship;
            }, 0) +
            state.value.power.pioneer.reduce((prev, ship) => {
                return prev += ship;
            }, 0);
        return Number.parseInt((5000 / Math.pow(state.value.time + 50, 0.36) - Math.pow(powers, 0.6)) * 10);
    });

    //添加武器
    function addBuki() {
        state.value.buki.push({ ...buki_template });
    }

    //删除武器
    function removeBuki(index) {
        if (state.value.buki.length > 1) {
            state.value.buki.splice(index, 1);
        }
    }

    //Roll
    function roll() {
        let kill = 0;
        for (let t = 0; t < state.value.times; t++) {
            let hp = 0;
            state.value.buki.forEach((buki) => {
                for (let i = 0; i < buki.hit; i++) {
                    //命中
                    if (isRateEffect(buki.accuracy_rate) === false) continue;
                    //暴击
                    hp += buki.damage * (isRateEffect(buki.crit_rate) ? (buki.crit_damage / 100) : 1);
                }
            });
            if (hp >= state.value.health) {
                kill++;
            }
        }

        if (state.value.times > 0) {
            kill_rate.value = kill / state.value.times;
        }
        else {
            kill_rate.value = 0;
        }

        function isRateEffect(rate) {
            if (Math.random() * 100 < rate) return true;
            else return false;
        }
    }
</script>

<template>
    <div class="excalc-top">
        <div class="excalc-power">
            <div class="excalc-label">
                <span>参数</span>
                <select class="excalc-param-selector" v-model="params.current.value" @change="params.change">
                    <option v-for="(data, index) in params.data.value" :value="index">{{ data.name }}</option>
                </select>
                <div class="excalc-param-handlers">
                    <mb-button :disabled="params.current.value === void(0)" @click="params.save">保存</mb-button>
                    <mb-button @click="params.add">新建</mb-button>
                    <mb-button :disabled="params.current.value === void(0)" @click="params.remove">删除</mb-button>
                </div>
            </div>
            <div class="excalc-label">
                <span>标题</span>
                <mb-input type="text" v-model="state.name"/>
            </div>
            <div class="excalc-label">
                <span>后排</span>
                <mb-input v-for="(item, index) in state.power.main" type="number" v-model="state.power.main[index]"/>
            </div>
            <div class="excalc-label">
                <span>前排</span>
                <mb-input v-for="(item, index) in state.power.pioneer" type="number" v-model="state.power.pioneer[index]"/>
            </div>
        </div>
        <div class="excalc-main">
            <label>
                <span>血量</span>
                <mb-input type="number" v-model="state.health"/>
            </label>
            <label>
                <span>次数</span>
                <mb-input type="number" v-model="state.times"/>
            </label>
            <mb-button full @click="roll">Roll</mb-button>
            <label>
                <span>斩杀率</span>
                <mb-input type="number" readonly v-model="kill_rate"/>
            </label>
            <div class="excalc-division"></div>
            <label>
                <span>时间</span>
                <mb-input type="number" v-model="state.time"/>
            </label>
            <label>
                <span>分数</span>
                <mb-input type="number" readonly v-model="score"/>
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
                <tr v-for="item, index in state.buki">
                    <td><mb-input type="text" v-model="item.name"/></td>
                    <td><mb-input type="number" v-model="item.damage"/></td>
                    <td><mb-input type="number" v-model="item.hit"/></td>
                    <td><mb-input type="number" :accuracy="2" v-model="item.accuracy_rate"/></td>
                    <td><mb-input type="number" :accuracy="2" v-model="item.crit_rate"/></td>
                    <td><mb-input type="number" :accuracy="2" v-model="item.crit_damage"/></td>
                    <td><mb-button class="excalc-delete" @click="removeBuki(index)">删除</mb-button></td>
                </tr>
            </tbody>
        </coco-table>
    </div>
</template>

<style lang="scss" scoped>
    .excalc-top {
        display: flex;
        justify-content: space-between;
        gap: 32px;
    }

    .excalc-param-selector {
        flex: 1;
        padding: 3px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
    }

    .excalc-label {
        display: flex;
        align-items: center;
        gap: 16px;

        & + & {
            margin-top: 16px;
        }
    }

    .excalc-main {
        display: flex;
        flex-direction: column;
        gap: 16px;

        > label {
            display: flex;
            align-items: center;

            > span {
                margin-right: 16px;
            }
        }
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
    }

    .excalc-tools {
        pointer-events: none;

        > button {
            pointer-events: auto;
        }
    }

    .excalc-table {
        td {
            padding-block: 4px;
        }
    }

    .excalc-delete {
        width: 58px;
    }

    @container main (width >= 596px) {
        .excalc-power {
            max-width: 512px;
        }
    }

    @container main (width < 596px) {
        .excalc-top {
            flex-direction: column;
            gap: 16px;
        }

        .excalc-bottom {
            margin-top: 16px;
        }
    }
</style>