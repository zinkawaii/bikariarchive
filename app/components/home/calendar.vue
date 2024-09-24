<script lang="ts" setup>
    import dayjs from "dayjs";
    import lunisolar from "lunisolar";
    import jTimeline from "~/assets/json/Timeline.json";

    interface CalendarDate {
        year: number;
        month: number;
        solar: number;
        lunar: string;
        event?: TimelineEvent;
    }

    interface TimelineEvent {
        mono: string;
        heroine: string[];
        hitokoto?: string;
    }

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

    const currentYear = ref(2019);
    const currentMonth = ref(6);
    const currentDates = ref<CalendarDate[]>([]);
    const currentDate = ref<CalendarDate>();

    //监听年月并显示日期
    watchImmediate([
        currentYear,
        currentMonth
    ], ([
        year,
        month
    ]) => {
        const dates = [];

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
            const [y, m] = month === 0
                ? [year - 1, 0]
                : [year, month - 1];

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
            const [y, m] = month === 11
                ? [year + 1, 0]
                : [year, month + 1];

            for (let i = 0; i < total - length; i++) {
                dates.push(createDate(y, m, i + 1));
            }
        }

        //设置选中日期
        if (currentDate.value) {
            for (const date of dates) {
                if (currentDate.value.solar === date.solar &&
                    currentDate.value.month === date.month &&
                    currentDate.value.year === date.year
                ) {
                    currentDate.value = date;
                    break;
                }
            }
        }

        //更新日期列表
        currentDates.value = dates;
    });

    //创建日期对象
    function createDate(year: number, month: number, day: number): CalendarDate {
        const base = new Date(year, month, day);

        const solar = dayjs(base);
        const lunar = lunisolar(base);

        return {
            year: year,
            month: month,
            solar: day,
            lunar: getSubTitle(),
            event: jTimeline[solar.format("YYYY-MM-DD")]
        };

        //副标题
        function getSubTitle() {
            //节气
            if (lunar.solarTerm) {
                return lunar.solarTerm.name;
            }

            //月初
            if (lunar.lunar.day === 1) {
                return lunar.lunar.getMonthName();
            }

            //日期
            return lunar.lunar.getDayName();
        }
    }

    //是否为起始月份
    const isFirstMonth = computed(() => {
        return currentYear.value === startDate.year() && currentMonth.value === startDate.month();
    });

    //是否为结束月份
    const isLastMonth = computed(() => {
        return currentYear.value === endDate.year() && currentMonth.value === endDate.month();
    });

    //上一月份
    function toLastMonth() {
        if (currentMonth.value === 0) {
            currentMonth.value = 11;
            currentYear.value--;
        }
        else {
            currentMonth.value--;
        }
    }

    //下一月份
    function toNextMonth() {
        if (currentMonth.value === 11) {
            currentMonth.value = 0;
            currentYear.value++;
        }
        else {
            currentMonth.value++;
        }
    }
</script>

<template>
    <div class="content-widget home-calendar">
        <div class="calendar-wrapper">
            <div class="calendar-header">
                <span class="calendar-month">{{ currentMonth + 1 }}° {{ monthMap[currentMonth][0] }}</span>
                <span class="text-primary">「{{ monthMap[currentMonth][1] }}」</span>
                <a
                    class="calendar-switch"
                    :class="{ [`is-hidden`]: isFirstMonth }"
                    @click="toLastMonth"
                ><iconify name="fa6-solid:chevron-left"/></a>
                <a
                    class="calendar-switch"
                    :class="{ [`is-hidden`]: isLastMonth }"
                    @click="toNextMonth"
                ><iconify name="fa6-solid:chevron-right"/></a>
            </div>
            <ul class="calendar-week">
                <li v-for="date in ['一', '二', '三', '四', '五', '六', '日']">{{ date }}</li>
            </ul>
            <div class="calendar-days">
                <a
                    v-for="date in currentDates"
                    class="calendar-day"
                    :class="{
                        [`is-sub`]: currentMonth !== date.month,
                        [`is-special`]: date.event,
                        [`is-checked`]: currentDate === date
                    }"
                    @click="currentDate = (currentDate === date) ? null : date"
                >
                    <span class="solar">{{ date.solar }}</span>
                    <span class="lunar">{{ date.lunar }}</span>
                </a>
            </div>
        </div>
        <div class="calendar-detail">
            <template v-if="currentDate">
                <time class="calendar-date">
                    {{ currentDate.month + 1 || "" }}月{{ currentDate.solar }}日
                </time>
                <h6 class="calendar-title">事件</h6>
                <p v-if="currentDate.event?.mono" class="calendar-event">
                    <iconify name="fa6-solid:quote-left"/>
                    <span>{{ currentDate.event.mono }}</span>
                    <iconify name="fa6-solid:quote-right"/>
                </p>
                <span v-else class="calendar-none">No Special.</span>
                <h6 class="calendar-title">关键人物</h6>
                <div v-if="currentDate.event?.heroine" class="calendar-heroine">
                    <character-tag v-for="heroine in currentDate.event.heroine" :key="heroine" :name="heroine"/>
                </div>
                <span v-else class="calendar-none">No Character.</span>
                <p class="calendar-hitokoto">{{ currentDate.event?.hitokoto }}</p>
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
        padding-inline: 12px 4px;
        border-radius: 12px;
        background-color: var(--color-theme);
        line-height: 28px;
    }

    .calendar-switch {
        display: grid;
        place-items: center;
        width: 28px;
        color: var(--color-theme-text);
        transition: all 0.15s;

        &.is-hidden {
            opacity: 0;
            pointer-events: none;
        }
    }

    .calendar-month {
        font-size: 16px;
        font-weight: bold;
    }

    .calendar-week, .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        text-align: center;
    }

    .calendar-week {
        margin-bottom: 4px;
        padding-block: 6px;
        border-bottom: 1px dashed var(--color-theme-dark);
    }

    .calendar-day {
        display: flex;
        flex-direction: column;
        position: relative;
        width: 46px;
        padding: 4px;

        &:hover {
            box-shadow: 0 0 0 1px var(--color-theme-dark) inset;
        }

        &.is-sub {
            opacity: 0.75;
            color: var(--color-text-info);
        }

        &.is-special {
            font-weight: bold;
            color: var(--color-theme-text);
        }

        &.is-checked {
            background: var(--color-theme-dark);
            font-weight: bold;
            color: white;
        }

        > .lunar {
            font-size: 12px;
            font-weight: normal;
        }
    }

    .calendar-detail {
        display: flex;
        flex-direction: column;
        padding: 16px;
        border: 6px dashed var(--color-theme-dark);
        border-radius: 16px;
        text-align: center;
    }

    .calendar-date {
        font-family: var(--font-smooth);
        font-size: 32px;
        letter-spacing: 2px;
        color: var(--color-theme-text);
    }

    .calendar-title {
        margin-top: 12px;
        font-size: 12px;
        line-height: 16px;
        color: var(--color-text-info);

        &::before, &::after {
            content: "——";
            padding-inline: 6px;
        }
    }

    .calendar-none {
        line-height: 32px;
        color: var(--color-text-info);
    }

    .calendar-event {
        line-height: 32px;

        > .iconify {
            font-size: 12px;
            color: var(--color-theme-dark);

            &:nth-of-type(1) {
                translate: -2px -1px;
            }

            &:nth-of-type(3) {
                translate: 2px 3px;
            }
        }
    }

    .calendar-heroine {
        display: flex;
        gap: 8px;
        overflow: auto;
        width: fit-content;
        max-width: 100%;
        margin: 9px auto 0;
        padding-bottom: 2px;
        animation-name: heroine;
        animation-timeline: scroll(x self);
        scroll-snap-type: x mandatory;

        > .character-tag {
            scroll-snap-align: center;
        }
    }

    @keyframes heroine {
        0% {
            mask-image: linear-gradient(to right, white calc(100% - 2rem), transparent);
        }

        1%, 99% {
            mask-image: linear-gradient(to right, transparent, white 2rem, white calc(100% - 2rem), transparent);
        }

        100% {
            mask-image: linear-gradient(to right, transparent, white 2rem);
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
                var(--color-theme) 0,
                var(--color-theme-dark) $h
            );
        line-height: $h;
        white-space: pre-line;
    }

    .calendar-default {
        opacity: 0.5;
        margin: auto;
        font-size: 48px;
        font-weight: bold;
        color: var(--color-text-info);
    }
</style>