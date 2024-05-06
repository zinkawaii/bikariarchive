<script setup>
    useHead({
        title: "日文名发生装置"
    });

    const toastStore = useToastStore();

    let Jnm = null;
    const isJnmLoaded = ref(false);
    const isJnmLoading = ref(false);

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
    const results = ref([]);

    //分列结果
    const chunkedResults = computed(() => {
        const median = Math.ceil(results.value.length / 2);
        return [
            results.value.slice(0, median),
            results.value.slice(median)
        ];
    });

    //结果是否为空
    const isResultEmpty = computed(() => {
        return results.value.length === 0;
    });

    //生成
    function generate() {
        //从静态资源服务器读取数据，防止打包文件过大
        if (!isJnmLoaded.value) {
            isJnmLoading.value = true;
            return $fetch("/json/Jnm.json").then((data) => {
                Jnm = data;
                isJnmLoaded.value = true;
                isJnmLoading.value = false;
                toastStore.success("jnm-loaded", "数据集已加载");
            });
        }

        //清空结果
        clear();

        //指定汉字与假名
        const pre_last_kanji = specific.value.last.kanji || specific.value.last.kana;
        const pre_last_kana = specific.value.last.kana || specific.value.last.kanji;
        const pre_first_kanji = specific.value.first.kanji || specific.value.first.kana;
        const pre_first_kana = specific.value.first.kana || specific.value.first.kanji;

        const count = counter.value.current;
        const sex = gender.value.current;

        for (let i = 0; i < count; i++) {
            const {
                last = pre_last_kanji,
                last_kana = pre_last_kana
            } = pre_last_kana ? {} : getLastName();
            const {
                first = pre_first_kanji,
                first_kana = pre_first_kana
            } = pre_first_kana ? {} : getFirstName(sex);

            results.value.push({
                kanji: last + " " + first,
                kana: last_kana + "　" + first_kana
            });
        }
    }

    //清空结果
    function clear() {
        results.value.length = 0;
    }

    //姓
    function getLastName() {
        const r = Math.floor(100 * Math.random());
        const [kanji, kana] = r < 10 ?
            getRandomItems(Jnm["01"], Jnm["01_kana"]) : r < 55 ?
            getRandomItems(Jnm["02"], Jnm["02_kana"]) : r < 65 ?
            getRandomItems(Jnm["03"], Jnm["03_kana"]) : r < 70 ?
            getRandomItems(Jnm["04"], Jnm["04_kana"]) :
            getRandomItems(Jnm["23"], Jnm["23_kana"]);

        return {
            last: kanji,
            last_kana: kana
        };
    }

    //名
    function getFirstName(gender) {
        let a, b;
        const [k05, k06, k07, k08, k11, k12, k13, k24, k26] = gender === "male" ?
            ["05", "06", "07", "08", "11", "12", "13", "24", "26"] :
            ["14", "15", "16", "17", "20", "21", "22", "25", "27"];

        const r = Zin.randInt(0, 1000);
        if (r < 100) {
            [a, b] = getRandomItems(Jnm[k05], Jnm[`${k05}_kana`]);
        }
        else if (r < 540) {
            if (Zin.randInt(0, 100) < 70) {
                [a, b] = getRandomItems(Jnm[k06], Jnm[`${k06}_kana`]);
            }
            else {
                do {
                    const [m1, m2] = getRandomItems(Jnm[k11], Jnm[`${k11}_kana`]);
                    const [n1, n2] = getRandomItems(Jnm[k12], Jnm[`${k12}_kana`]);
                    a = m1 + n1;
                    b = m2 + n2;
                } while (!Jnm[`${k13}_kana`].includes(b));
            }
        }
        else if (r < 649) {
            if (Zin.randInt(0, 100) < 70) {
                [a, b] = getRandomItems(Jnm[k07], Jnm[`${k07}_kana`]);
            }
            else {
                do {
                    const [i1, i2] = getRandomItems(Jnm[k11], Jnm[`${k11}_kana`]);
                    const [m1, m2] = getRandomItems(Jnm[k26], Jnm[`${k26}_kana`]);
                    const [n1, n2] = getRandomItems(Jnm[k12], Jnm[`${k12}_kana`]);
                    a = i1 + m1 + n1;
                    b = i2 + m2 + n2;
                } while (!Jnm[`${k13}_kana`].includes(b));
            }
        }
        else if (r < 650) {
            [a, b] = getRandomItems(Jnm[k08], Jnm[`${k08}_kana`]);
        }
        else if (r < 700) {
            a = b = getRandomItem(Jnm[`${k13}_kana`]);
        }
        else {
            [a, b] = getRandomItems(Jnm[k24], Jnm[`${k24}_kana`]);
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
            <p class="p-small">本页面用于生成日文名，数据集与随机算法均来自 <plain-link to="https://namaemaker.net" target="_blank">namaemaker.net</plain-link></p>
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
            <mb-button :disabled="isJnmLoading" @click="generate">
                <template v-if="isJnmLoading || !isJnmLoaded">
                    <icon v-if="isJnmLoading" v-gsap.rotate name="mingcute:loading-fill"/>
                    <icon v-else name="fa6-solid:download"/>
                    <span>加载</span>
                </template>
                <template v-else>
                    <icon name="iconamoon:star-bold"/>
                    <span>生成</span>
                </template>
            </mb-button>
            <mb-button :disabled="isResultEmpty" @click="clear">
                <icon name="fa6-solid:trash-can"/>
                <span>清除结果</span>
            </mb-button>
        </div>
    </div>
    <div v-if="!isResultEmpty" class="div-table namae-result">
        <dl v-for="chunk in chunkedResults" class="namae-col">
            <template v-for="item in chunk">
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