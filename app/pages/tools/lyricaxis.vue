<script lang="ts" setup>
    useHead({
        title: "歌词打轴"
    });

    //文件名
    const filename = ref("");

    //是否有效
    const invalid = ref(true);

    //当前时长
    const currentTime = ref(0);

    //总时长
    const duration = ref(0);

    //播放进度
    const progress = ref(0);

    //是否正在播放
    const [isPlaying, togglePlaying] = useToggle(false);

    //是否正在拖动
    const [isDragging, toggleDragging] = useToggle(false);

    //是否正在打轴
    const [isAxising, toggleAxising] = useToggle(false);

    //纯文本
    const raw = ref("");

    //歌词列表
    const lyrics = ref<{
        sign: boolean;
        time: number;
        timed: string;
        content: string;
    }[]>([]);

    //当前歌词序号
    const currentLyric = ref(0);

    //音频对象
    const audioEl = ref<HTMLAudioElement>();

    //音频可以播放
    useEventListener(audioEl, "canplay", () => {
        invalid.value = false;
        duration.value = audioEl.value.duration;
    });

    //音频错误
    useEventListener(audioEl, "error", () => {
        filename.value = "";
    });

    //音频结束播放
    useEventListener(audioEl, "ended", () => {
        togglePlaying(false);
    });

    //音频播放时
    useEventListener(audioEl, "timeupdate", () => {
        if (isDragging.value) return;
        currentTime.value = audioEl.value.currentTime;
        progress.value = currentTime.value / duration.value;
    });

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
            filename.value = file.name;
            invalid.value = true;
            currentTime.value = 0;
            duration.value = 0;
            progress.value = 0;
            isPlaying.value = false;
            isAxising.value = false;

            //链接
            URL.revokeObjectURL(audioEl.value.src);
            audioEl.value.src = URL.createObjectURL(file);
        });
    }

    //播放 & 暂停
    watch(isPlaying, (val) => {
        if (val) {
            audioEl.value.play();
        }
        else {
            audioEl.value.pause();
        }
    });

    //当前时长显示值
    const formatedCurrent = computed(() => {
        return formatTime(currentTime.value);
    });

    //总时长显示值
    const formatedDuration = computed(() => {
        return formatTime(duration.value);
    });

    //时间格式化
    function formatTime(time: number) {
        const m = time / 60;
        const s = time % 60;
        return `${String(Math.floor(m)).padStart(2, "0")}:${String(Math.floor(s)).padStart(2, "0")}`;
    }

    //进度正在改变时
    function onControlProgress(rate: number) {
        if (!invalid.value) {
            currentTime.value = duration.value * rate;
        }
    }

    //进度改变时
    function onControlChange(rate: number) {
        if (!invalid.value) {
            audioEl.value.currentTime = duration.value * rate;
        }
        else {
            //音频无效，进度归零
            progress.value = 0;
        }
    }

    //导出
    function exporter() {
        const output = getCompileText();
        Zin.download(output, {
            filename: `${filename.value}.lrc`
        });
    }

    //打轴
    watch(isAxising, (val) => {
        if (val) {
            lyrics.value = raw.value.split("\n").map((line) => {
                let sign = false;
                let time = 0;
                let timed = "";
                const re = /\[(\d{2}):(\d{2}\.\d{3})\]/;
                const match = line.match(re);
                if (match) {
                    sign = true;
                    time = Number(match[1]) * 60 + Number(match[2]);
                    timed = match[0];
                }
                return {
                    sign,
                    time,
                    timed,
                    content: line.replace(re, "") || "　"
                };
            });
        }
        else {
            //复制歌词
            raw.value = getCompileText();

            //初始化序号
            currentLyric.value = 0;
        }
    });

    //回退
    function undo() {
        const {
            [currentLyric.value - 1]: last,
            [currentLyric.value - 2]: target
        } = lyrics.value;

        //回到两句前的时间点
        audioEl.value.currentTime = target?.time || 0;

        if (last) {
            last.sign = false;
            last.time = 0;
            last.timed = "";

            //指向不存在的序号时不再减少
            currentLyric.value--;
        }
    }

    //标记
    function sign() {
        const time = currentTime.value;
        const current = lyrics.value[currentLyric.value];

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
            currentLyric.value++;
        }
    }

    //获取打轴结果
    function getCompileText() {
        return lyrics.value.map((item) => {
            return item.timed + item.content;
        }).join("\n");
    }
</script>

<template>
    <coco-widget>
        <audio ref="audioEl"></audio>
        <div class="text-small">
            <div class="lyric-operator">
                <mb-button @click="upload">上传</mb-button>
                <mb-button :disabled="invalid" @click="togglePlaying()">{{ !invalid && isPlaying ? "暂停" : "播放" }}</mb-button>
                <mb-button :disabled="invalid" @click="exporter">导出</mb-button>
                <mb-button :disabled="invalid" @click="toggleAxising()">{{ isAxising ? "结束打轴" : "开始打轴" }}</mb-button>
            </div>
            <div class="lyric-control">
                <time>{{ formatedCurrent }}</time>
                <mb-slider
                    class="lyric-progress"
                    v-model="progress"
                    @progress="onControlProgress"
                    @change="onControlChange"
                    @dragstart="toggleDragging(true)"
                    @dragend="toggleDragging(false)"
                />
                <time>{{ formatedDuration }}</time>
            </div>
        </div>
        <div class="lyric-main">
            <textarea v-if="!isAxising" class="lyric-editor" placeholder="在这里输入歌词……" v-model="raw"></textarea>
            <div v-else class="lyric-editor">
                <article>
                    <p
                        v-for="(item, i) in lyrics"
                        :key="i"
                        class="lyric-item"
                        :class="{
                            light: currentLyric === i,
                            sign: item.sign
                        }"
                        @click="currentLyric = i"
                        ><time>{{ item.timed }}</time>
                        <span>{{ item.content }}</span>
                    </p>
                </article>
                <ul class="lyric-handler">
                    <li><mb-button @click="undo">回退</mb-button></li>
                    <li><mb-button @click="sign">标记</mb-button></li>
                </ul>
            </div>
        </div>
    </coco-widget>
</template>

<style lang="scss" scoped>
    .lyric-operator {
        display: grid;
        grid-template-columns: auto auto 1fr auto;
        justify-items: flex-end;
    }

    .lyric-control {
        display: grid;
        grid-template-columns: 54px 1fr 54px;
        align-items: center;
        height: 32px;
        margin-top: 16px;
        text-align: center;
        color: var(--color-text-info);
    }

    .lyric-main {
        display: grid;
        position: relative;
        height: 512px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 16px;
        background-color: var(--color-background);
        font-size: 14px;
        line-height: 24px;
    }

    .lyric-editor {
        padding: 8px 16px;
        border-radius: inherit;
    }

    .lyric-item {
        margin-inline: -8px;
        padding-inline: 8px;
        border-radius: 8px;
        user-select: none;

        &.sign {
            color: var(--color-text-info);
        }

        &.light {
            color: var(--color-theme-text);
        }

        &:hover {
            background-color: var(--color-info-light-8);
        }
    }

    .lyric-handler {
        display: grid;
        gap: 8px;
        position: absolute;
        right: 16px;
        bottom: 16px;
    }
</style>