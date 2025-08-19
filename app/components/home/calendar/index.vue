<script lang="ts" setup>
    import { format, getDay, getDaysInMonth, getMonth, getYear } from "date-fns";
    import lunisolar from "lunisolar";
    import jTimeline, { type TimelineEvent } from "~/assets/json/Timeline.json";

    export interface CalendarDate {
        year: number;
        month: number;
        solar: number;
        lunar: string;
        event?: TimelineEvent;
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
        ["胧月", "おぼろづき"],
    ];

    //日期范围
    const startDate = new Date("2018-11-07");
    const endDate = new Date("2019-12-31");

    const currentYear = ref(2019);
    const currentMonth = ref(6);
    const currentDates = ref<CalendarDate[]>([]);
    const currentDate = ref<CalendarDate>();

    //监听年月并显示日期
    watchImmediate([currentYear, currentMonth], ([year, month]) => {
        const dates = [];

        //当月第一天
        const firstDay = new Date(year, month);

        //添加当月日期
        const count = getDaysInMonth(firstDay);
        for (let i = 0; i < count; i++) {
            dates.push(createDate(year, month, i + 1));
        }

        //添加上月日期
        const weekday = (getDay(firstDay) + 6) % 7;
        if (weekday > 0) {
            const [y, m] = month === 0
                ? [year - 1, 0]
                : [year, month - 1];

            const firstDay = new Date(y, m);
            const count = getDaysInMonth(firstDay);
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
        const solar = new Date(year, month, day);
        const lunar = lunisolar(solar);

        return {
            year,
            month,
            solar: day,
            lunar: getSubTitle(),
            event: jTimeline[format(solar, "yyyy-MM-dd")],
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
        return currentYear.value === getYear(startDate) && currentMonth.value === getMonth(startDate);
    });

    //是否为结束月份
    const isLastMonth = computed(() => {
        return currentYear.value === getYear(endDate) && currentMonth.value === getMonth(endDate);
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
    <div class="home-calendar content-widget no-scrollbar">
        <div class="calendar-wrapper">
            <div class="calendar-header">
                <span class="calendar-month">{{ currentMonth + 1 }}° {{ monthMap[currentMonth][0] }}</span>
                <span class="text-primary">「{{ monthMap[currentMonth][1] }}」</span>
                <button
                    class="calendar-switch"
                    :class="{ [`is-hidden`]: isFirstMonth }"
                    @click="toLastMonth"
                ><iconify name="fa7-solid:chevron-left"/></button>
                <button
                    class="calendar-switch"
                    :class="{ [`is-hidden`]: isLastMonth }"
                    @click="toNextMonth"
                ><iconify name="fa7-solid:chevron-right"/></button>
            </div>
            <ul class="calendar-week">
                <li v-for="date in ['一', '二', '三', '四', '五', '六', '日']">{{ date }}</li>
            </ul>
            <div class="calendar-days">
                <button
                    v-for="date in currentDates"
                    class="calendar-day"
                    :class="{
                        [`is-sub`]: currentMonth !== date.month,
                        [`is-special`]: date.event,
                        [`is-checked`]: currentDate === date,
                    }"
                    @click="currentDate = (currentDate === date) ? void 0 : date"
                >
                    <span class="solar">{{ date.solar }}</span>
                    <span class="lunar">{{ date.lunar }}</span>
                </button>
            </div>
        </div>
        <home-calendar-detail :date="currentDate"/>
    </div>
</template>

<style lang="scss" scoped>
    $width: 48px;
    $gap: 2px;
    $min: $width * 7 + $gap * 6;

    .home-calendar {
        display: grid;
        grid-template-columns: $min minmax($min, auto);
        gap: 8px;
        overflow: auto;
        padding: 4px;
        font-size: 14px;
        scroll-snap-type: x mandatory;
    }

    .calendar-wrapper, .calendar-detail {
        scroll-snap-align: center;
    }

    .calendar-wrapper {
        overflow: hidden;
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
    }

    .calendar-week, .calendar-days {
        display: grid;
        grid-template-columns: repeat(7, $width);
        gap: $gap;
        text-align: center;
    }

    .calendar-week {
        margin-bottom: 4px;
        padding-block: 6px;
        border-bottom: 1px dashed var(--color-theme-dark);
    }

    .calendar-day {
        display: grid;
        padding: 4px;
        font-variant-numeric: tabular-nums;

        &:hover {
            box-shadow: 0 0 0 1px var(--color-theme-dark) inset;
        }

        &.is-sub {
            opacity: 0.75;
            color: var(--color-info);
        }

        &.is-special {
            color: var(--color-theme-text);
        }

        &.is-checked {
            background-color: var(--color-theme-dark);
            color: white;
        }

        > .lunar {
            font-size: 12px;
        }
    }
</style>
