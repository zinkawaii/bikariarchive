<script lang="ts" setup>
    import type { CalendarDate } from "./index.vue";

    defineProps<{
        date?: CalendarDate;
    }>();
</script>

<template>
    <div class="calendar-detail">
        <template v-if="date">
            <time class="calendar-date">
                {{ date.month + 1 || "" }}月{{ date.solar }}日
            </time>
            <h6 class="calendar-title">事件</h6>
            <p v-if="date.event?.mono" class="calendar-event">
                <iconify name="fa6-solid:quote-left"/>
                <span>{{ date.event.mono }}</span>
                <iconify name="fa6-solid:quote-right"/>
            </p>
            <span v-else class="calendar-none">No Special.</span>
            <h6 class="calendar-title">关键人物</h6>
            <div v-if="date.event?.heroine" class="calendar-heroine edge-fades-x">
                <character-tag v-for="heroine in date.event.heroine" :key="heroine" :name="heroine"/>
            </div>
            <span v-else class="calendar-none">No Character.</span>
            <p class="calendar-hitokoto">{{ date.event?.hitokoto }}</p>
        </template>
        <span v-else class="calendar-default">No Data</span>
    </div>
</template>

<style lang="scss" scoped>
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
        letter-spacing: 1px;
        color: var(--color-theme-text);
    }

    .calendar-title {
        margin-top: 12px;
        font-size: 12px;
        line-height: 16px;
        color: var(--color-info);

        &::before, &::after {
            content: "——";
            padding-inline: 6px;
        }
    }

    .calendar-none {
        line-height: 32px;
        color: var(--color-info);
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
        max-width: 100%;
        margin: 9px auto 0;
        padding-bottom: 2px;
        scroll-snap-type: x mandatory;

        > .character-tag {
            scroll-snap-align: center;
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
        color: var(--color-info);
    }
</style>