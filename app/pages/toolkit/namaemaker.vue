<script lang="ts" setup>
    import { load } from "#build/namaemaker";

    useHead({
        title: "日文名发生装置",
    });

    const toastStore = useToastStore();

    let Jnm: Record<string, string[]>;
    const { execute, status, data } = useAsyncData(load, {
        immediate: false,
    });

    const countList = [1, 10, 100, 500];
    const genderList = [
        { label: "男", value: "male" },
        { label: "女", value: "female" },
    ];

    //数量
    const count = ref(1);

    //性别
    const gender = ref("female");

    //指定（姓）
    const specLast = ref({
        kanji: "",
        kana: "",
    });

    //指定（名）
    const specFirst = ref({
        kanji: "",
        kana: "",
    });

    //结果
    const results = shallowRef<{
        kanji: string;
        kana: string;
    }[]>([]);

    //分列结果
    const chunks = computed(() => {
        const median = Math.ceil(results.value.length / 2);
        return [
            results.value.slice(0, median),
            results.value.slice(median),
        ];
    });

    //清空结果
    function clear() {
        results.value = [];
    }

    //生成
    async function generate() {
        if (status.value === "idle") {
            await execute();
            Jnm = data.value!;
            toastStore.success("[jnm]:load", "数据集已加载");
            return;
        }

        //清空结果
        clear();

        //指定汉字与假名
        const specLastKanji = specLast.value.kanji || specLast.value.kana;
        const specLastKana = specLast.value.kana || specLast.value.kanji;
        const specFirstKanji = specFirst.value.kanji || specFirst.value.kana;
        const specFirstKana = specFirst.value.kana || specFirst.value.kanji;

        results.value = Array.from({ length: count.value }, () => {
            const [
                lastKanji = specLastKanji,
                lastKana = specLastKana,
            ] = specLastKana ? [] : getLastName();
            const [
                firstKanji = specFirstKanji,
                firstKana = specFirstKana,
            ] = specFirstKana ? [] : getFirstName(gender.value);

            return {
                kanji: lastKanji + " " + firstKanji,
                kana: lastKana + "　" + firstKana,
            };
        });
    }

    //姓
    function getLastName() {
        const r = randomInt(0, 100);
        const [kanji, kana] =
            r < 10 ? randomItems(Jnm["01"], Jnm["01_kana"]) :
            r < 55 ? randomItems(Jnm["02"], Jnm["02_kana"]) :
            r < 65 ? randomItems(Jnm["03"], Jnm["03_kana"]) :
            r < 70 ? randomItems(Jnm["04"], Jnm["04_kana"]) :
            randomItems(Jnm["23"], Jnm["23_kana"]);

        return [kanji, kana] as const;
    }

    //名
    function getFirstName(gender: string) {
        let a = "";
        let b = "";
        const [k05, k06, k07, k08, k11, k12, k13, k24, k26] = gender === "male"
            ? ["05", "06", "07", "08", "11", "12", "13", "24", "26"]
            : ["14", "15", "16", "17", "20", "21", "22", "25", "27"];

        const r = randomInt(0, 1000);
        if (r < 100) {
            [a, b] = randomItems(Jnm[k05], Jnm[`${k05}_kana`]);
        }
        else if (r < 540) {
            if (randomInt(0, 100) < 70) {
                [a, b] = randomItems(Jnm[k06], Jnm[`${k06}_kana`]);
            }
            else {
                do {
                    const [m1, m2] = randomItems(Jnm[k11], Jnm[`${k11}_kana`]);
                    const [n1, n2] = randomItems(Jnm[k12], Jnm[`${k12}_kana`]);
                    a = m1 + n1;
                    b = m2 + n2;
                } while (!Jnm[`${k13}_kana`].includes(b));
            }
        }
        else if (r < 649) {
            if (randomInt(0, 100) < 70) {
                [a, b] = randomItems(Jnm[k07], Jnm[`${k07}_kana`]);
            }
            else {
                do {
                    const [i1, i2] = randomItems(Jnm[k11], Jnm[`${k11}_kana`]);
                    const [m1, m2] = randomItems(Jnm[k26], Jnm[`${k26}_kana`]);
                    const [n1, n2] = randomItems(Jnm[k12], Jnm[`${k12}_kana`]);
                    a = i1 + m1 + n1;
                    b = i2 + m2 + n2;
                } while (!Jnm[`${k13}_kana`].includes(b));
            }
        }
        else if (r < 650) {
            [a, b] = randomItems(Jnm[k08], Jnm[`${k08}_kana`]);
        }
        else if (r < 700) {
            a = b = randomItem(Jnm[`${k13}_kana`]);
        }
        else {
            [a, b] = randomItems(Jnm[k24], Jnm[`${k24}_kana`]);
        }

        return [a, b] as const;
    }
</script>

<template>
    <meow-widget title="日文名发生装置">
        <div class="p-small">
            <div class="namae-option">
                <span class="text-gray">介绍</span>
                <p class="p-small">本页面用于生成日文名，数据集与随机算法均来自 <plain-link to="https://namaemaker.net" target="_blank">namaemaker.net</plain-link></p>
            </div>
            <div class="namae-option">
                <span class="text-gray">数量</span>
                <div class="namae-radio">
                    <mb-radio
                        v-for="item in countList"
                        :value="item"
                        v-model="count"
                    >{{ item }}</mb-radio>
                </div>
            </div>
            <div class="namae-option">
                <span class="text-gray">性别</span>
                <div class="namae-radio">
                    <mb-radio
                        v-for="{ label, value } in genderList"
                        :value
                        v-model="gender"
                    >{{ label }}</mb-radio>
                </div>
            </div>
            <div class="namae-option">
                <span class="text-gray">指定</span>
                <div class="namae-specific">
                    <input placeholder="姓" v-model="specLast.kanji"/>
                    <input placeholder="姓（读音）" v-model="specLast.kana"/>
                    <input placeholder="名" v-model="specFirst.kanji"/>
                    <input placeholder="名（读音）" v-model="specFirst.kana"/>
                </div>
            </div>
            <div class="namae-operator">
                <mb-button :disabled="status === `pending`" @click="generate">
                    <template v-if="status !== `success`">
                        <iconify
                            v-if="status === `pending`"
                            v-anime="{ rotate: 360, duration: 1500, ease: `linear`, loop: true }"
                            name="mingcute:loading-fill"
                        />
                        <iconify v-else name="fa7-solid:download"/>
                        <span>加载</span>
                    </template>
                    <template v-else>
                        <iconify name="iconamoon:star-bold"/>
                        <span>生成</span>
                    </template>
                </mb-button>
                <mb-button :disabled="!results.length" @click="clear">
                    <iconify name="fa7-solid:trash-can"/>
                    <span>清除结果</span>
                </mb-button>
            </div>
        </div>
        <meow-table v-if="results.length" class="namae-result" variant="div">
            <dl v-for="chunk in chunks">
                <template v-for="{ kanji, kana } in chunk">
                    <dt>{{ kanji }}</dt>
                    <dd>{{ kana }}</dd>
                </template>
            </dl>
        </meow-table>
    </meow-widget>
</template>

<style lang="scss" scoped>
    .namae-option {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1.6em;
        margin-bottom: 0.6em;
    }

    .namae-radio {
        display: grid;
        grid-template-columns: repeat(auto-fit, 4.5em);
    }

    .namae-specific {
        display: grid;
        grid-template: repeat(2, 1fr) / repeat(2, minmax(auto, 128px));
        gap: 0.5em 1em;

        > input {
            padding-bottom: 2px;
            border-bottom: 1px solid var(--color-border-light);
        }
    }

    .namae-operator {
        margin-top: 16px;
    }

    .namae-result {
        margin-top: 16px;
        font-size: 14px;

        @include viewport("md") {
            flex-direction: column;
        }
    }
</style>
