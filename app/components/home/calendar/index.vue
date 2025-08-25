<script lang="ts" setup>
    import { toLunar } from "@kabeep/lunar-date-fns";
    import { format, getDay, getDaysInMonth, getMonth, getYear } from "date-fns";
    import jSpecial from "~/assets/json/Special.json";

    export interface CalendarDate {
        key: string;
        year: number;
        month: number;
        day: number;
        lunar: string;
    }

    //月份别名
    const monthAlias = [
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

    //二十四节气
    const solarTerms: Record<number, string>[] = [
        { 4: "立春", 19: "雨水" },
        { 4: "惊蛰", 19: "春分" },
        { 5: "清明", 20: "谷雨" },
        { 5: "立夏", 20: "小满" },
        { 5: "芒种", 21: "夏至" },
        { 6: "小暑", 22: "大暑" },
        { 7: "立秋", 23: "处暑" },
        { 7: "白露", 23: "秋分" },
        { 8: "寒露", 23: "霜降" },
        { 8: "立冬", 23: "小雪" },
        { 7: "大雪", 22: "冬至" },
        { 7: "小寒", 21: "大寒" },
    ];

    //月份名称
    const monthNames = ["正月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "冬月", "腊月"];

    //日期名称
    const dayNames = [
        ["初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十"],
        ["十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"],
        ["廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"],
    ].flat();

    const startDate = new Date("2018-11-07");
    const endDate = new Date("2019-12-31");

    const currentYear = ref(2019);
    const currentMonth = ref(6);

    const currentDates = computed(() => {
        return [...generateDates(currentYear.value, currentMonth.value)];
    });

    const currentKey = ref<string>();
    const currentDate = computed(() => {
        return currentDates.value.find(({ key }) => currentKey.value === key);
    });

    function* generateDates(year: number, month: number) {
        //当月第一天
        const firstDay = new Date(year, month);

        //上月日期
        const weekday = (getDay(firstDay) + 6) % 7;
        if (weekday > 0) {
            const [y, m] = month === 0
                ? [year - 1, 11]
                : [year, month - 1];

            const firstDay = new Date(y, m);
            const count = getDaysInMonth(firstDay);
            for (let i = 0; i < weekday; i++) {
                const d = count - weekday + i + 1;
                yield createDate(y, m, d);
            }
        }

        //当月日期
        const count = getDaysInMonth(firstDay);
        for (let i = 0; i < count; i++) {
            yield createDate(year, month, i + 1);
        }

        //下月日期
        const total = 42;
        if (weekday + count < total) {
            const [y, m] = month === 11
                ? [year + 1, 0]
                : [year, month + 1];

            for (let i = 0; i < total - weekday - count; i++) {
                yield createDate(y, m, i + 1);
            }
        }
    }

    //创建日期对象
    function createDate(year: number, month: number, day: number): CalendarDate {
        const solar = new Date(year, month, day);
        const lunar = toLunar(solar);
        const key = format(solar, "yyyy-MM-dd");

        return {
            key,
            year,
            month,
            day,
            lunar: lunar !== -1
                ? solarTerms[lunar.month - 1]?.[lunar.day] ?? (
                    lunar.day === 1
                        ? monthNames[lunar.month - 1]
                        : dayNames[lunar.day - 1]
                )
                : "",
        };
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
            currentYear.value--;
        }
        currentMonth.value = (currentMonth.value + 11) % 12;
    }

    //下一月份
    function toNextMonth() {
        if (currentMonth.value === 11) {
            currentYear.value++;
        }
        currentMonth.value = (currentMonth.value + 1) % 12;
    }
</script>

<template>
    <div class="home-calendar content-widget no-scrollbar">
        <div class="calendar-wrapper">
            <div class="calendar-header">
                <span class="calendar-month">{{ currentMonth + 1 }}° {{ monthAlias[currentMonth][0] }}</span>
                <span class="text-primary">「{{ monthAlias[currentMonth][1] }}」</span>
                <button
                    class="calendar-switch"
                    :class="{ [`is-hidden`]: isFirstMonth }"
                    aria-label="上个月"
                    @click="toLastMonth"
                ><iconify name="fa7-solid:chevron-left"/></button>
                <button
                    class="calendar-switch"
                    :class="{ [`is-hidden`]: isLastMonth }"
                    aria-label="下个月"
                    @click="toNextMonth"
                ><iconify name="fa7-solid:chevron-right"/></button>
            </div>
            <ul class="calendar-week">
                <li v-for="date in [`一`, `二`, `三`, `四`, `五`, `六`, `日`]">{{ date }}</li>
            </ul>
            <div class="calendar-days">
                <button
                    v-for="{ key, month, day, lunar } in currentDates"
                    :key
                    class="calendar-day"
                    :class="{
                        [`is-sub`]: currentMonth !== month,
                        [`is-special`]: key in jSpecial,
                        [`is-checked`]: currentKey === key,
                    }"
                    @click="currentKey = (currentKey === key) ? void 0 : key"
                >
                    {{ day }}<span class="is-lunar">{{ lunar }}</span>
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
        font-size: 1rem;
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

        > .is-lunar {
            font-size: 12px;
        }
    }
</style>
