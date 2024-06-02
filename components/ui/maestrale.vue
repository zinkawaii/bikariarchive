<script lang="ts" setup>
    import jMae from "~/assets/json/Maestrale.json";

    const contextMenuStore = useContextMenuStore();
    const settingStore = useSettingStore();

    let audio: HTMLAudioElement = null;
    const $mae = ref();
    const serif = ref("");
    const skin = useLocalStorage("maestrale-skin", 0);
    const isAuto = useLocalStorage("maestrale-auto", false);
    const toggleAuto = useToggle(isAuto);
    const [isDialog, toggleDialog] = useToggle(false);

    //右键菜单
    contextMenuStore.extra($mae, [
        {
            title: "自动",
            icon: "bi:chat-dots-fill",
            checked: isAuto,
            action: () => {
                toggleAuto();
            }
        },
        {
            title: "换装",
            icon: "emojione-monotone:womans-clothes",
            children: [
                "西北风",
                "独处的沙滩一角"
            ].map((name, i) => ({
                title: name,
                checked: computed(() => skin.value === i),
                action() {
                    skin.value = i;
                }
            }))
        }
    ]);

    //换装时的动画
    function onLoad() {
        $mae.value.$el.animate([
            { rotate: "y 90deg" },
            {}
        ], Zin.DEFAULT_ANIME_OPTION);
    }

    //随机播放语音
    async function say() {
        $mae.value.$el.animate([
            {},
            { translate: "0 -16px" },
            {}
        ], {
            duration: 150
        });

        toggleDialog(true);
        if (audio) return;

        const info = getRandomItem(jMae.audio);
        const curSerif = info[`serif_${skin.value}`];
        const isSerifExist = skin.value && curSerif;
        const suffix = isSerifExist ? `_skin_${skin.value}` : "";
        serif.value = curSerif || info.serif;

        const src = `${jMae.path}${info.title}${suffix}.${jMae.format}`;

        audio = new Audio(src);
        audio.play();
        audio.addEventListener("ended", () => {
            audio = null;
            toggleDialog(false);
        });
    }

    //自动播放语音（每3秒判定，9%概率触发）
    onMounted(() => {
        Zin.interval(() => {
            if (isAuto.value && Math.random() < 0.09) {
                say();
            }
        }, {
            duration: 3000
        });
    });
</script>

<template>
    <div class="z-maestrale" :class="{ [`is-collapse`]: settingStore.setting[`ui-collapse`] }">
        <client-only>
            <nuxt-img
                ref="$mae"
                class="maestrale-dollfie"
                :src="`/garden/maestrale/skin_${skin}.png`"
                densities="1"
                @load="onLoad"
                @click="say"
            />
        </client-only>
        <transition>
            <article v-show="isDialog" class="maestrale-dialog" @click="toggleDialog(false)">
                <p>{{ serif }}</p>
            </article>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
    .z-maestrale {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        position: fixed;
        bottom: 0;
        transition: translate 0.4s;
        pointer-events: none;

        &.is-collapse {
            translate: 0 100%;
        }
    }

    .maestrale-dollfie {
        cursor: pointer;
        pointer-events: auto;
        -webkit-user-drag: none;
        user-select: none;
    }

    .maestrale-dialog {
        display: flex;
        align-items: center;
        max-width: 282px;
        padding: 9px 14px;
        border: 1px solid var(--color-border-lighter);
        border-radius: 16px;
        background-color: var(--color-background);
        font-size: 14px;
        line-height: 20px;
        filter: drop-shadow(var(--box-shadow-dark));
        pointer-events: auto;

        &:where(.v-enter-active, .v-leave-active) {
            transition: all 0.25s;
        }

        &:where(.v-enter-from, .v-leave-to) {
            opacity: 0;
        }

        &::before {
            content: "";
            position: absolute;
            left: -6px;
            width: 12px;
            aspect-ratio: 1;
            border: 1px solid var(--color-border-lighter);
            background-color: var(--color-background);
            clip-path:
                polygon(
                    0 0,
                    100% 0,
                    0 100%
                );
            rotate: -45deg;
        }
    }
</style>