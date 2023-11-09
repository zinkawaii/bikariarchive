<script setup>
    useHead({
        title: "歌词打轴"
    });

    const data = reactive({
        //音频相关
        filename: "",
        invalid: true,
        playing: false,
        duration: 0,
        current: 0,

        //打轴相关
        axising: false
    });

    const lyric = ref({
        raw: "",
        data: [],
        current: 0
    });

    const audio = new Audio();
    const $Control = ref();

    //音频可以播放
    audio.addEventListener("canplay", () => {
        data.invalid = null;
        data.duration = audio.duration;
    });

    //音频错误
    audio.addEventListener("error", () => {
        data.filename = "";
    });

    //音频结束播放
    audio.addEventListener("ended", () => {
        data.playing = false;
    });

    //音频播放时
    audio.addEventListener("timeupdate", () => {
        if (!$Control.value.dragging) {
            data.current = audio.currentTime;

            //进度条
            const rate = data.current / data.duration;
            $Control.value.rate = rate;
        }
    });

    //上传
    function upload()
    {
        showOpenFilePicker({
            types: [{
                accept: {
                    "audio/*": [".mp3"]
                }
            }]
        })
        .then((handle) => handle[0].getFile())
        .then((file) => {
            //状态初始化
            data.filename = file.name;
            data.invalid = true;
            data.playing = false;
            data.duration = 0;
            data.current = 0;
            data.axising = false;
            $Control.value.rate = 0;

            //链接
            URL.revokeObjectURL(audio.src);
            audio.src = URL.createObjectURL(file);
        });
    }

    //播放 & 暂停
    function play()
    {
        if (data.playing ^= 1) {
            audio.play();
        }
        else {
            audio.pause();
        }
    }

    //进度正在改变时
    function controlProgress(event)
    {
        data.current = data.duration * event.rate;
    }

    //进度改变时
    function controlChange(event)
    {
        if (!data.invalid) {
            audio.currentTime = data.duration * event.rate;
        }
        else {
            //音频无效，进度归零
            $Control.value.rate = 0;
        }
    }

    //导出
    function exporter()
    {
        const output = getCompileText();
        Zin.download(output, "blob", `${data.filename}.lrc`);
    }

    //打轴
    function axis()
    {
        if (data.axising ^= 1) {
            //清空数据
            lyric.value.data.length = 0;

            lyric.value.raw.split("\n").forEach((line, index) => {
                let sign = false;
                let time = 0;
                let timed = "";
                const re = /\[(\d{2}):(\d{2}\.\d{3})\]/;
                const match = line.match(re);
                if (match) {
                    sign = true;
                    time = match[1] * 60 + match[2] * 1;
                    timed = match[0];
                }

                lyric.value.data.push({
                    index,
                    sign,
                    time,
                    timed,
                    content: line.replace(re, "") || "　"
                });
            });
        }
        else {
            //复制歌词
            lyric.value.raw = getCompileText();

            //初始化序号
            lyric.value.current = 0;
        }
    }

    //回退
    function undo() {
        const {
            [lyric.value.current - 1]: last,
            [lyric.value.current - 2]: target
        } = lyric.value.data;

        //回到两句前的时间点
        audio.currentTime = target?.time || 0;

        if (last) {
            last.sign = false;
            last.time = "";
            last.timed = "";

            //指向不存在的序号时不再减少
            lyric.value.current--;
        }
    }

    //标记
    function sign() {
        const time = audio.currentTime;
        const current = lyric.value.data[lyric.value.current];

        if (current) {
            const m = time / 60;
            const s = time % 60;

            //格式化时间点
            current.sign = true;
            current.time = time;
            current.timed = `[${
                String(Math.floor(m)).padStart(2, "0")
            }:${
                s.toFixed(3).padStart(6, "0")
            }]`;

            //指向不存在的序号时不再增加
            lyric.value.current++;
        }
    }

    //获取打轴结果
    function getCompileText()
    {
        return lyric.value.data.map((item) => {
            return item.timed + item.content;
        }).join("\n");
    }

    //时间格式化
    function timeFormat(time)
    {
        const m = time / 60;
        const s = time % 60;
        return `${String(Math.floor(m)).padStart(2, "0")}:${String(Math.floor(s)).padStart(2, "0")}`;
    }
</script>

<template>
    <div class="lyric-player">
        <a class="btn" @click="upload">上传</a>
        <a class="btn" @click="play" :disabled="data.invalid">{{ !data.invalid && data.playing ? "暂停" : "播放" }}</a>
        <span>
            <a class="btn" @click="exporter" :disabled="data.invalid">导出</a>
            <a class="btn" @click="axis" :disabled="data.invalid">{{ data.axising ? "结束打轴" : "开始打轴" }}</a>
        </span>
        <div>
            <span class="lyric-time">{{ timeFormat(data.current) }}</span>
            <mb-progress class="lyric-control" ref="$Control" @progress="controlProgress" @change="controlChange">{{ data.filename || "- 请上传歌曲 -" }}</mb-progress>
            <span class="lyric-time">{{ timeFormat(data.duration) }}</span>
        </div>
    </div>
    <div class="lyric-main">
        <textarea class="lyric-textarea lyric-editor" placeholder="在这里输入歌词……" v-model="lyric.raw"></textarea>
        <div class="lyric-textarea lyric-compile" :class="{ show: data.axising }">
            <article>
                <p v-for="item in lyric.data" :class="{
                    light: lyric.current === item.index,
                    sign: item.sign
                }" :key="item.index" :data-time="item.time" @click="lyric.current = item.index">
                    <time>{{ item.timed }}</time>
                    <span>{{ item.content }}</span>
                </p>
            </article>
            <ul class="lyric-handle">
                <li><a class="btn" @click="undo">回退</a></li>
                <li><a class="btn" @click="sign">标记</a></li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .lyric-player {
        font-size: 14px;

        > span {
            float: right;
        }

        > div {
            display: flex;
            margin: 16px 0 0;
        }
    }

    .lyric-time {
        display: block;
        width: 54px;
        margin: auto;
        text-align: center;
        color: var(--color-gray);
    }

    .lyric-control {
        flex: 1;
        height: 32px;
        box-shadow: 0 6px 12px -8px var(--color-gray);
        z-index: 1;
    }

    .lyric-main {
        position: relative;
        height: 512px;
        transform: scale(1, 1);
    }

    .lyric-textarea {
        padding: 8px 16px;
        border: 1px solid var(--color-border-light);
        border-radius: 8px;
        font-size: 14px;
    }

    .lyric-editor {
        width: 100%;
        height: 100%;
        line-height: 24px;
        resize: none;
    }

    .lyric-compile {
        display: none;
        position: absolute;
        overflow: auto;
        inset: 0;
        background-color: white;

        > article > p {
            margin: 0 -8px;
            padding: 0 8px;
            border-radius: 8px;
            font-size: 14px;
            line-height: 24px;
            user-select: none;

            &.sign {
                color: var(--color-gray);
            }

            &.light {
                color: var(--color-theme-text);
            }

            &:hover {
                background-color: var(--color-theme-block-light);
            }
        }

        &.show {
            display: block;
        }
    }

    .lyric-handle {
        display: flex;
        flex-direction: column;
        gap: 8px;
        position: fixed;
        right: 16px;
        bottom: 8px;

        .btn:not(:hover) {
            background-color: white;
        }
    }
</style>