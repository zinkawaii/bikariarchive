<script setup>
    useHead({
        title: "日文名发生装置"
    });

    let Jnm = null;
    const isJnmLoaded = ref(false);

    //从静态资源服务器读取数据，防止打包文件过大
    if (process.browser) {
        Zjax.get("/json/Jnm.json").then((data) => {
            Jnm = data;
            isJnmLoaded.value = true;
        });
    }

    //数量
    const counter = ref({
        list: [1, 10, 100, 500],
        current: 1
    });

    //性别
    const gender = ref({
        list: [
            {
                title: "男",
                value: "male"
            },
            {
                title: "女",
                value: "female"
            }
        ],
        current: "female"
    });

    //指定
    const specific = ref({
        last: {
            kanji: "",
            kana: ""
        },
        first: {
            kanji: "",
            kana: ""
        }
    });

    //结果
    const result = ref([[], []]);

    //生成
    function generate() {
        const count = counter.value.current;
        const sex = gender.value.current;

        //指定汉字与假名
        const pre_last_kanji = specific.value.last.kanji || specific.value.last.kana;
        const pre_last_kana = specific.value.last.kana || specific.value.last.kanji;
        const pre_first_kanji = specific.value.first.kanji || specific.value.first.kana;
        const pre_first_kana = specific.value.first.kana || specific.value.first.kanji;

        //分列生成
        result.value.forEach((colume, index) => {
            colume.length = 0;
            for (let i = Math.ceil(count / result.value.length * index); i < Math.ceil(count / result.value.length * (index + 1)); i++) {
                const {
                    last = pre_last_kanji,
                    last_kana = pre_last_kana
                } = pre_last_kana ? {} : getLastName();
                const {
                    first = pre_first_kanji,
                    first_kana = pre_first_kana
                } = pre_first_kana ? {} : getFirstName(sex);

                colume.push({
                    kanji: last + " " + first,
                    kana: last_kana + "　" + first_kana
                });
            }
        });
    }

    //清空结果
    function clear() {
        result.value.forEach((colume) => colume.length = 0);
    }

    const isResultEmpty = computed(() => {
        return result.value.reduce((previous, current) => {
            return previous + current.length;
        }, 0) === 0;
    });

    //姓
    function getLastName() {
        let kanji, i;

        const r = Math.floor(100 * Math.random());
        const kana = r < 10 ? (i = Math.floor(Math.random() * Jnm["01"].length),
        kanji = Jnm["01"][i],
        Jnm["01_kana"][i]) : r < 55 ? (i = Math.floor(Math.random() * Jnm["02"].length),
        kanji = Jnm["02"][i],
        Jnm["02_kana"][i]) : r < 65 ? (i = Math.floor(Math.random() * Jnm["03"].length),
        kanji = Jnm["03"][i],
        Jnm["03_kana"][i]) : r < 70 ? (i = Math.floor(Math.random() * Jnm["04"].length),
        kanji = Jnm["04"][i],
        Jnm["04_kana"][i]) : (i = Math.floor(Math.random() * Jnm["23"].length),
        kanji = Jnm["23"][i],
        Jnm["23_kana"][i]);

        return {
            last: kanji,
            last_kana: kana
        };
    }

    //名
    function getFirstName(gender) {
        let r, i, m, n, a, b;
        if (gender === "male") {
            if ((r = Math.floor(1e3 * Math.random())) < 100) {
                i = Math.floor(Math.random() * Jnm["05"].length),
                a = Jnm["05"][i],
                b = Jnm["05_kana"][i];
            }
            else if (r < 540) {
                if ((r = Math.floor(100 * Math.random())) < 70) {
                    i = Math.floor(Math.random() * Jnm["06"].length),
                    a = Jnm["06"][i],
                    b = Jnm["06_kana"][i];
                }
                else {
                    do {
                        m = Math.floor(Math.random() * Jnm["11"].length),
                        n = Math.floor(Math.random() * Jnm["12"].length),
                        a = Jnm["11"][m] + Jnm["12"][n],
                        b = Jnm["11_kana"][m] + Jnm["12_kana"][n];
                    } while (!Jnm["13_kana"].includes(b));
                }
            }
            else if (r < 649) {
                if ((r = Math.floor(100 * Math.random())) < 70) {
                    i = Math.floor(Math.random() * Jnm["07"].length),
                    a = Jnm["07"][i],
                    b = Jnm["07_kana"][i];
                }
                else {
                    do {
                        i = Math.floor(Math.random() * Jnm["11"].length),
                        m = Math.floor(Math.random() * Jnm["26"].length),
                        n = Math.floor(Math.random() * Jnm["12"].length),
                        a = Jnm["11"][i] + Jnm["26"][m] + Jnm["12"][n],
                        b = Jnm["11_kana"][i] + Jnm["26_kana"][m] + Jnm["12_kana"][n];
                    } while (!Jnm["13_kana"].includes(b));
                }
            }
            else if (r < 650) {
                i = Math.floor(Math.random() * Jnm["08"].length),
                a = Jnm["08"][i],
                b = Jnm["08_kana"][i];
            }
            else if (n < 700) {
                i = Math.floor(Math.random() * Jnm["13_kana"].length),
                a = b = Jnm["13_kana"][i];
            }
            else {
                i = Math.floor(Math.random() * Jnm["24"].length),
                a = Jnm["24"][i],
                b = Jnm["24_kana"][i];
            }
        }
        else if (gender === "female") {
            if ((r = Math.floor(1e3 * Math.random())) < 100) {
                i = Math.floor(Math.random() * Jnm["14"].length),
                a = Jnm["14"][i],
                b = Jnm["14_kana"][i];
            }
            else if (r < 540) {
                if ((r = Math.floor(100 * Math.random())) < 70) {
                    i = Math.floor(Math.random() * Jnm["15"].length),
                    a = Jnm["15"][i],
                    b = Jnm["15_kana"][i];
                }
                else {
                    do {
                        m = Math.floor(Math.random() * Jnm["20"].length),
                        n = Math.floor(Math.random() * Jnm["21"].length),
                        a = Jnm["20"][m] + Jnm["21"][n],
                        b = Jnm["20_kana"][m] + Jnm["21_kana"][n];
                    } while (!Jnm["22_kana"].includes(b));
                }
            }
            else if (r < 649) {
                if ((r = Math.floor(100 * Math.random())) < 70) {
                    i = Math.floor(Math.random() * Jnm["16"].length),
                    a = Jnm["16"][i],
                    b = Jnm["16_kana"][i];
                }
                else {
                    do {
                        i = Math.floor(Math.random() * Jnm["20"].length),
                        m = Math.floor(Math.random() * Jnm["27"].length),
                        n = Math.floor(Math.random() * Jnm["21"].length),
                        a = Jnm["20"][i] + Jnm["27"][m] + Jnm["21"][n],
                        b = Jnm["20_kana"][i] + Jnm["27_kana"][m] + Jnm["21_kana"][n];
                    } while (!Jnm["22_kana"].includes(b));
                }
            }
            else if (r < 650) {
                i = Math.floor(Math.random() * Jnm["17"].length),
                a = Jnm["17"][i],
                b = Jnm["17_kana"][i];
            }
            else if (r < 700) {
                i = Math.floor(Math.random() * Jnm["22_kana"].length),
                a = b = Jnm["22_kana"][i];
            }
            else {
                i = Math.floor(Math.random() * Jnm["25"].length),
                a = Jnm["25"][i],
                b = Jnm["25_kana"][i];
            }
        }
        return {
            first: a,
            first_kana: b
        };
    }
</script>

<template>
    <div class="p-small">
        <div class="namae-option">
            <span>介绍</span>
            <p class="p-small">本页面用于生成日文名，数据库与随机算法均来自<coco-link to="https://namaemaker.net" target="_blank">namaemaker.net</coco-link></p>
        </div>
        <div class="namae-option">
            <span>数量</span>
            <div class="namae-radio">
                <mb-radio
                    v-for="item in counter.list"
                    :value="item"
                    v-model="counter.current"
                >{{ item }}</mb-radio>
            </div>
        </div>
        <div class="namae-option">
            <span>性别</span>
            <div class="namae-radio">
                <mb-radio
                    v-for="item in gender.list"
                    :value="item.value"
                    v-model="gender.current"
                >{{ item.title }}</mb-radio>
            </div>
        </div>
        <div class="namae-option">
            <span>指定</span>
            <div class="namae-specific">
                <input type="text" placeholder="姓" v-model="specific.last.kanji"/>
                <input type="text" placeholder="姓（读音）" v-model="specific.last.kana"/>
                <input type="text" placeholder="名" v-model="specific.first.kanji"/>
                <input type="text" placeholder="名（读音）" v-model="specific.first.kana"/>
            </div>
        </div>
        <div class="namae-operator">
            <mb-button :disabled="!isJnmLoaded" @click="generate">生成</mb-button>
            <mb-button @click="clear">清除结果</mb-button>
        </div>
    </div>
    <div v-if="!isResultEmpty" class="div-table namae-result">
        <dl class="namae-col">
            <template v-for="item in result[0]">
                <dt>{{ item.kanji }}</dt>
                <dd>{{ item.kana }}</dd>
            </template>
        </dl>
        <dl class="namae-col">
            <template v-for="item in result[1]">
                <dt>{{ item.kanji }}</dt>
                <dd>{{ item.kana }}</dd>
            </template>
        </dl>
    </div>
</template>

<style lang="scss" scoped>
    .namae-option {
        display: flex;
        gap: 1.6em;

        & + & {
            margin-top: 0.6em;
        }

        > span {
            color: var(--color-text-info);

            + * {
                flex: 1;
            }
        }
    }

    .namae-radio {
        display: flex;

        > label {
            min-width: 4.5em;
        }
    }

    .namae-specific {
        display: grid;
        grid-template: repeat(2, 1fr) / repeat(2, minmax(auto, 128px));
        gap: 0.5em 1em;

        input {
            padding-bottom: 2px;
            border-bottom: 1px solid var(--color-border-light);
            background: transparent;
        }
    }

    .namae-operator {
        margin-top: 16px;
    }

    .namae-result {
        margin-top: 16px;
    }

    @container main (width < 768px) {
        .namae-result {
            flex-direction: column;
        }
    }
</style>