<script setup>
    const settingStore = useSettingStore();

    const time = ref({
        hour: 0,
        minute: 0,
        second: 0
    });

    const clocks = ref([]);
    for (let i = 0; i < 6; i++) {
        const clock = {
            index: i,
            seat: i
        };

        /* 原位坐标 */({
            x: clock.sitX,
            y: clock.sitY
        } = getXY(clock, "index"));

        clocks.value.push(clock);
    }

    //走时
    Zin.setInterval(() => {
        const now = new Date();
        time.value.hour = now.getHours();
        time.value.minute = now.getMinutes();
        time.value.second = now.getSeconds();
    }, {
        duration: 1000
    });

    //获取时间
    function getTime(i) {
        switch (i) {
            case 0: return Math.floor(time.value.hour / 10);
            case 1: return time.value.hour % 10;
            case 2: return Math.floor(time.value.minute / 10);
            case 3: return time.value.minute % 10;
            case 4: return Math.floor(time.value.second / 10);
            case 5: return time.value.second % 10;
        }
    }

    //点击互换
    function exchange(i) {
        let r;
        do {
            r = Zin.randInt(0, 5);
        } while (r === clocks.value[i].seat);

        const a = clocks.value[i];
        const b = clocks.value[r];

        const {
            x: a_x,
            y: a_y
        } = getXY(a, "seat");

        const {
            x: b_x,
            y: b_y
        } = getXY(b, "seat");

        a.translate = `${b_x - a.sitX}px ${b_y - a.sitY}px`;
        b.translate = `${a_x - b.sitX}px ${a_y - b.sitY}px`;

        [a.seat, b.seat] = [b.seat, a.seat];
    }

    //根据类型获取坐标
    function getXY(item, type) {
        return {
            x: item[type] * (32 + 6),
            y: item[type] % 2 === 0 ? 16 : 0
        };
    }

    const display = ref(true);
    watch(() => [
        settingStore.setting["sidebar-display"],
        settingStore.setting["ui-collapse"]
    ], ([s, u]) => {
        display.value = {
            0: !u,
            1: true,
            2: false
        }[s];
    }, {
        immediate: true
    });
</script>

<template>
    <div class="z-sidebar" :hidden="!display">
        <ClientOnly>
            <ul class="clock-table">
                <li v-for="i in 6" class="clock-item" :style="{ translate: clocks[i - 1].translate }" @click="exchange(i - 1)">
                    <span>{{ getTime(i - 1) }}</span>
                </li>
            </ul>
        </ClientOnly>
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
    .z-sidebar {
        display: flex;
        flex-direction: column;
        gap: 24px;
        position: sticky;
        top: 96px;
        width: 256px;
        height: calc(100vh - 128px);

        &[hidden] {
            display: none;
        }
    }

    .clock-table {
        display: flex;
        gap: 6px;
        position: relative;
        top: 0;
        left: 0;
        margin-bottom: -8px;
        padding: 0 17px 20px;

        &::before {
            content: "";
            position: absolute;
            top: 24px;
            left: 0;
            width: 100%;
            height: 34px;
            border-bottom: var(--border-theme-group);
            border-radius: 16px;
            box-shadow: var(--box-shadow);
            background-color: color-mix(in srgb, var(--color-background), transparent 30%);
        }
    }

    .clock-item {
        position: relative;
        width: 32px;
        height: 32px;
        transition: translate 0.4s;
        cursor: pointer;
        user-select: none;

        &:nth-child(2n) {
            margin-top: 16px;
        }

        &::before {
            content: "";
            display: block;
            width: 32px;
            height: 32px;
            box-shadow: var(--box-shadow);
            background-color: var(--color);
            transform: rotate(45deg);
        }

        > span {
            position: absolute;
            inset: 0;
            width: fit-content;
            height: fit-content;
            margin: auto;
            font-family: "腾祥沁圆简";
            font-size: 18px;
            text-shadow: var(--text-shadow);
            color: white;
        }

        &:nth-child(1) {
            --color: rgb(168 204 255);
        }

        &:nth-child(2) {
            --color: rgb(204 168 255);
        }

        &:nth-child(3) {
            --color: rgb(255 204 168);
        }

        &:nth-child(4) {
            --color: rgb(120 232 168);
        }

        &:nth-child(5) {
            --color: rgb(232 120 168);
        }

        &:nth-child(6) {
            --color: rgb(168 120 232);
        }
    }

    @media (width >= 1024px) {
        .mb-sidebar[hide] {
            display: none;
        }
    }

    @media (width < 1024px) {
        .z-sidebar {
            position: static;
            height: auto;
            min-width: var(--size-width-min-mobile);
            margin: auto;
            padding: 0 32px;
        }
    }
</style>