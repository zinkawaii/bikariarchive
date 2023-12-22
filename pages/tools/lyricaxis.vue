<script setup>
    useHead({
        title: "歌词打轴"
    });

    const state = ref({
        //音频相关
        src: "",
        filename: "",
        invalid: true,
        playing: false,
        duration: 0,
        current: 0,
        rate: 0,
        dragging: false,

        //打轴相关
        axising: false
    });

    const lyric = ref({
        raw: "",
        data: [],
        current: 0
    });

    const $Audio = ref();

    //音频可以播放
    function audioCanplay() {
        state.value.invalid = false;
        state.value.duration = $Audio.value.duration;
    }

    //音频错误
    function audioError() {
        state.value.filename = "";
    }

    //音频结束播放
    function audioEnded() {
        state.value.playing = false;
    }

    //音频播放时
    function audioTimeupdate() {
        if (!state.value.dragging) {
            state.value.current = $Audio.value.currentTime;

            //进度条
            const rate = state.value.current / state.value.duration;
            state.value.rate = rate;
        }
    }

    //上传
    function upload() {
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
            state.value.filename = file.name;
            state.value.invalid = true;
            state.value.playing = false;
            state.value.duration = 0;
            state.value.current = 0;
            state.value.axising = false;
            state.value.rate = 0;

            //链接
            URL.revokeObjectURL(state.value.src);
            state.value.src = URL.createObjectURL(file);
        });
    }

    //播放 & 暂停
    function play() {
        if (state.value.playing ^= 1) {
            $Audio.value.play();
        }
        else {
            $Audio.value.pause();
        }
    }

    //进度正在改变时
    function controlProgress(event) {
        if (!state.value.invalid) {
            state.value.current = state.value.duration * event.rate;
        }
    }

    //进度改变时
    function controlChange(event) {
        if (!state.value.invalid) {
            $Audio.value.currentTime = state.value.duration * event.rate;
        }
        else {
            //音频无效，进度归零
            state.value.rate = 0;
        }
    }

    //导出
    function exporter() {
        const output = getCompileText();
        Zin.download(output, "blob", `${state.value.filename}.lrc`);
    }

    //打轴
    function axis() {
        if (state.value.axising ^= 1) {
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
        $Audio.value.currentTime = target?.time || 0;

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
        const time = state.value.current;
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
    function getCompileText() {
        return lyric.value.data.map((item) => {
            return item.timed + item.content;
        }).join("\n");
    }

    //时间格式化
    function timeFormat(time) {
        const m = time / 60;
        const s = time % 60;
        return `${String(Math.floor(m)).padStart(2, "0")}:${String(Math.floor(s)).padStart(2, "0")}`;
    }
</script>

<template>
    <div class="lyric-player">
        <audio
            ref="$Audio"
            :src="state.src"
            @canplay="audioCanplay"
            @error="audioError"
            @ended="audioEnded"
            @timeupdate="audioTimeupdate"
        ></audio>
        <a class="btn" @click="upload">上传</a>
        <a :class="[`btn`, { disabled: state.invalid }]" @click="play">{{ !state.invalid && state.playing ? "暂停" : "播放" }}</a>
        <span>
            <a :class="[`btn`, { disabled: state.invalid }]" @click="exporter">导出</a>
            <a :class="[`btn`, { disabled: state.invalid }]" @click="axis">{{ state.axising ? "结束打轴" : "开始打轴" }}</a>
        </span>
        <div>
            <span class="lyric-time">{{ timeFormat(state.current) }}</span>
            <mb-progress
                class="lyric-control"
                :title="state.filename || `- 请上传歌曲 -`"
                v-model="state.rate"
                @progress="controlProgress"
                @change="controlChange"
                @dragstart="state.dragging = true"
                @dragend="state.dragging = false"
            />
            <span class="lyric-time">{{ timeFormat(state.duration) }}</span>
        </div>
    </div>
    <div class="lyric-main">
        <textarea class="lyric-textarea lyric-editor" placeholder="在这里输入歌词……" v-model="lyric.raw"></textarea>
        <div class="lyric-textarea lyric-compile" :class="{ show: state.axising }">
            <article>
                <p
                    v-for="item in lyric.data"
                    :key="item.index"
                    :class="{
                        light: lyric.current === item.index,
                        sign: item.sign
                    }"
                    @click="lyric.current = item.index"
                   ><time>{{ item.timed }}</time>
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
            align-items: center;
            margin-top: 16px;
        }
    }

    .lyric-time {
        width: 54px;
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
        background-color: var(--color-background);
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

        p {
            margin-inline: -8px;
            padding-inline: 8px;
            border-radius: 8px;
            line-height: 24px;
            user-select: none;

            &.sign {
                color: var(--color-gray);
            }

            &.light {
                color: var(--color-theme-text);
            }

            &:hover {
                background-color: var(--color-theme-light);
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
    }
</style>