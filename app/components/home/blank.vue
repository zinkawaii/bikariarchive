<script lang="ts" setup>
    const serif = ref("");
    const serifs = [
        "あと少しだけでいい 満ち足りない",
        "可愛いだけではだめだってわかってる",
        "だけど君が知りたい 昨日とは違うんだ",
        "魔法みたいな 君の声まるで Magic だよ",
        "キミと出会う「奇跡」が 「運命」になった",
        "それでも不意に不安な夜には 強がるわたしを守ってね",
        "絶対確実見敵必殺勧善懲悪月下美人 一撃必殺全員葬るのじゃ",
        "日常が透けて見えてくる そっか そんながんばらなくでもいい世界",
        "もしも輪廻があるのなら 次もあなたの優しさ どうか どうか 与えて",
        "長く続くピークはグルービータイフーン 恋よりステキなトキメキ教えてあげる",
    ];

    //每7秒随机显示
    Zin.interval(() => {
        serif.value = randomItem(serifs);
    }, {
        server: false,
        duration: 7000,
    });
</script>

<template>
    <div class="home-blank content-widget">
        <div class="blank-title">空白板</div>
        <textarea class="blank-editor" :placeholder="serif"></textarea>
    </div>
</template>

<style lang="scss" scoped>
    .home-blank {
        display: grid;
        grid-template-rows: auto 1fr;
        padding: 4px;
    }

    .blank-title {
        border-radius: 12px;
        background-color: var(--color-theme);
        font-weight: bold;
        line-height: 28px;
        text-align: center;
    }

    .blank-editor {
        padding: 4px;
        font-size: 14px;
        line-height: 24px;
    }
</style>
