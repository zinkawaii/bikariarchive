<script setup>
    import dayjs from "dayjs";
    import lunisolar from "lunisolar";
    import zhCn from "lunisolar/locale/zh-cn";
    import jTimeline from "~/assets/json/Timeline.json";

    //简中语言包
    lunisolar.locale(zhCn);

    //月份别名
    const monthMap = [
        ["初空", "はつそら"],
        ["梅见", "うめみ"],
        ["夜樱", "よざくら"],
        ["清和", "せいわ"],
        ["浴兰", "よくらん"],
        ["蝉羽", "せみのは"],
        ["凉月", "すずつき"],
        ["月见", "つきみ"],
        ["竹醉", "ちくすい"],
        ["时雨", "しぐれ"],
        ["神乐", "かぐら"],
        ["胧月", "おぼろづき"]
    ];

    //日期范围
    const startDate = dayjs("2018/11/7");
    const endDate = dayjs("2019/12/31");

    //选中日期
    const currentDate = ref();

    //数据状态
    const state = ref({
        year: 2019,
        month: 6,
        dates: [],
        event: null
    });

    //监听年月并显示日期
    watchEffect(() => {
        const { year, month, dates } = state.value;

        //清空日期列表
        dates.length = 0;

        //当月第一天
        const firstDay = dayjs(new Date(year, month));

        //添加当月日期
        const count = firstDay.daysInMonth();
        for (let i = 0; i < count; i++) {
            dates.push(createDate(year, month, i + 1));
        }

        //添加上月日期
        const weekday = (firstDay.day() + 6) % 7;
        if (weekday > 0) {
            let y, m;
            if (month === 0) {
                y = year - 1;
                m = 11;
            }
            else {
                y = year;
                m = month - 1;
            }

            const firstDay = dayjs(new Date(y, m));
            const count = firstDay.daysInMonth();
            for (let i = weekday; i > 0; i--) {
                const d = count - weekday + i;
                dates.unshift(createDate(y, m, d));
            }
        }

        //添加下月日期
        const total = 42;
        const length = dates.length;
        if (length < total) {
            let y, m;
            if (month === 11) {
                y = year + 1;
                m = 0;
            }
            else {
                y = year;
                m = month + 1;
            }

            for (let i = 0; i < total - length; i++) {
                dates.push(createDate(y, m, i + 1));
            }
        }

        //设置选中日期
        if (currentDate.value) {
            for (const date of dates) {
                if (
                    currentDate.value.solar === date.solar &&
                    currentDate.value.month === date.month &&
                    currentDate.value.year === date.year
                ) {
                    currentDate.value = date;
                    break;
                }
            }
        }
    });

    //是否为起始月份
    const isFirstMonth = computed(() => {
        return state.value.year === startDate.year() && state.value.month === startDate.month();
    });

    //是否为结束月份
    const isLastMonth = computed(() => {
        return state.value.year === endDate.year() && state.value.month === endDate.month();
    });

    //上一月份
    function toLastMonth()
    {
        if (state.value.month === 0) {
            state.value.month = 11;
            state.value.year--;
        }
        else {
            state.value.month--;
        }
    }

    //下一月份
    function toNextMonth()
    {
        if (state.value.month === 11) {
            state.value.month = 0;
            state.value.year++;
        }
        else {
            state.value.month++;
        }
    }

    //创建日期对象
    function createDate(year, month, day)
    {
        const base = new Date(year, month, day);

        const solar = dayjs(base);
        const lunar = lunisolar(base);

        return {
            solar: day,
            lunar: getSubTitle(),
            month: month,
            year: year,
            event: jTimeline[solar.format("YYYY-MM-DD")]
        };

        //副标题
        function getSubTitle()
        {
            //节气
            if (lunar.solarTerm) {
                return lunar.solarTerm;
            }

            //月初
            if (lunar.lunar.day === 1) {
                return lunar.lunar.getMonthName();
            }

            //日期
            return lunar.lunar.getDayName();
        }
    }
</script>

<template>
    <div class="home-calendar">
        <div class="calendar-wrapper">
            <div class="calendar-header">
                <span class="calendar-month">{{ state.month + 1 }}° {{ monthMap[state.month][0] }}</span>
                <span class="text-primary">「{{ monthMap[state.month][1] }}」</span>
                <a :class="{ hidden: isFirstMonth }" @click="toLastMonth"><i class="fas fa-chevron-left"></i></a>
                <a :class="{ hidden: isLastMonth }" @click="toNextMonth"><i class="fas fa-chevron-right"></i></a>
            </div>
            <ul class="calendar-week">
                <li v-for="date in ['一', '二', '三', '四', '五', '六', '日']">{{ date }}</li>
            </ul>
            <div class="calendar-date">
                <a v-for="date in state.dates" :class="{
                    sub: date.month !== state.month,
                    special: date.event,
                    selected: currentDate === date
                }"
                @click="currentDate = (currentDate === date) ? null : date"
                   ><span class="solar">{{ date.solar }}</span>
                    <span class="lunar">{{ date.lunar }}</span>
                </a>
            </div>
        </div>
        <div class="calendar-detail">
            <template v-if="currentDate">
                <time class="calendar-detail-date">
                    <span class="month">{{ currentDate.month + 1 || "" }}</span>月<span class="day">{{ currentDate.solar }}</span>日
                </time>
                <div class="calendar-section">
                    <div class="title">事件</div>
                    <div class="calendar-event" v-if="currentDate.event?.mono">
                        <i class="fas fa-quote-left"></i>
                        <span>{{ currentDate.event.mono }}</span>
                        <i class="fas fa-quote-right"></i>
                    </div>
                    <span class="none" v-else>No Special.</span>
                </div>
                <div class="calendar-section">
                    <div class="title">关键人物</div>
                    <div class="calendar-heroine" v-if="currentDate.event?.heroine">
                        <div class="heroine-wrapper">
                            <nuxt-link v-for="heroine in currentDate.event.heroine" :to="`/${heroine}`">
                                <nuxt-img :src="`/garden/icon/${heroine}.png`" placeholder="/garden/icon/unknown.png"/>
                                <span>{{ heroine }}</span>
                            </nuxt-link>
                        </div>
                    </div>
                    <span class="none" v-else>No Character.</span>
                </div>
                <span class="calendar-hitokoto">{{ currentDate.event?.hitokoto }}</span>
            </template>
            <span v-else class="calendar-default">No Data</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .home-calendar {
        display: grid;
        grid-template-columns: auto 1fr;
        overflow: auto;
        border: var(--border-theme-group);
        border-radius: 16px;
        box-shadow: var(--box-shadow);
        background-color: var(--color-background-alpha);
        font-size: 14px;
        scroll-snap-type: x mandatory;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .calendar-wrapper, .calendar-detail {
        min-width: 334px;
        margin: 4px;
        scroll-snap-align: center;
    }

    .calendar-wrapper {
        overflow: auto;
        border-bottom-left-radius: 12px;
    }

    .calendar-header {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        border-radius: 12px;
        background-color: var(--color-theme-block);
        line-height: 28px;

        > a {
            padding: 0 12px;
            color: var(--color-theme-text);
            transition: all 0.15s;

            &.hidden {
                opacity: 0;
                pointer-events: none;
            }
        }
    }

    .calendar-month {
        padding-left: 12px;
        font-size: 16px;
        font-weight: bold;
    }

    .calendar-week, .calendar-date {
        display: grid;
        gap: 2px;
        grid-template-columns: repeat(7, 1fr);
        text-align: center;
    }

    .calendar-week {
        padding: 6px 0;
        border-bottom: 1px dashed var(--color-theme-block-dark);
    }

    .calendar-date {
        padding-top: 4px;

        > a {
            display: flex;
            flex-direction: column;
            position: relative;
            width: 46px;
            padding: 4px;
            color: var(--color-text);

            &:hover {
                box-shadow: 0 0 0 1px var(--color-theme-block-dark) inset;
            }

            &.sub {
                opacity: 0.75;
                color: var(--color-gray);
            }

            &.special {
                font-weight: bold;
                color: var(--color-theme-text);
            }

            &.selected {
                background: var(--color-theme-block-dark);
                font-weight: bold;
                color: white;
            }

            .lunar {
                font-size: 12px;
                font-weight: normal;
            }
        }
    }

    .calendar-detail {
        display: flex;
        flex-direction: column;
        padding: 16px;
        border: 6px dashed var(--color-theme-block-dark);
        border-radius: 16px;
        text-align: center;
        transition: filter 0.2s;
    }

    .calendar-detail-date {
        font-family: "腾祥沁圆简";
        font-size: 32px;
        letter-spacing: 2px;
        color: var(--color-theme-text);
    }

    .calendar-section {
        margin-top: 12px;

        .title {
            font-size: 12px;
            line-height: 16px;
            color: var(--color-gray);

            &::before, &::after {
                content: "——";
                padding-inline: 6px;
            }
        }

        .none {
            line-height: 32px;
            color: var(--color-gray);
        }
    }

    .calendar-event {
        line-height: 32px;

        > i {
            padding-inline: 4px;
            font-size: 12px;
            color: var(--color-theme-block-dark);

            &:nth-of-type(1) {
                translate: 0 -3px;
            }

            &:nth-of-type(2) {
                translate: 0 2px;
            }
        }
    }

    .calendar-heroine {
        display: flex;
        overflow: auto;
        padding-top: 9px;
    }

    .heroine-wrapper {
        display: flex;
        gap: 8px;
        margin: auto;

        > a {
            display: flex;
            align-items: center;
            padding-right: 8px;
            border: 1px solid var(--color-theme-block-dark);
            border-radius: 16px;
            background-color: var(--color-background);
            color: var(--color-theme-text);
        }

        img {
            width: 28px;
            height: 28px;
            margin: 2px;
            border-radius: 100%;
        }

        span {
            padding-inline: 5px;
            text-wrap: nowrap;
        }
    }

    .calendar-hitokoto {
        $h: 28px;

        margin: auto;
        background:
            repeating-linear-gradient(
                to bottom,
                transparent 0,
                transparent $h - 1px,
                var(--color-theme-block) 0,
                var(--color-theme-block-dark) $h
            );
        line-height: $h;
        white-space: pre-line;
    }

    .calendar-default {
        opacity: 0.5;
        font-size: 48px;
        font-weight: bold;
        color: var(--color-gray);

        .calendar-detail:has(&) {
            justify-content: center;
        }
    }
</style>