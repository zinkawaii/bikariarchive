<script lang="ts" setup>
    import { injectionKey } from "~/types/space";

    const {
        isMyself,
        nickname,
        sign: userSign,
        avatar
    } = inject(injectionKey);

    const toastStore = useToastStore();
    const headerUrl = Zin.background("/garden/background/space_header.webp");

    const sign = ref(userSign.value);
    let oldSign = "";

    //记录旧值
    function recordSign() {
        oldSign = sign.value;
    }

    //更新签名
    const updateSign = Zin.debounce(async () => {
        if (sign.value === oldSign) {
            return;
        }

        try {
            $fetch("/api/user/sign", {
                method: "put",
                body: {
                    content: sign.value
                }
            });
            userSign.value = sign.value;
        }
        catch {
            toastStore.error("[sign]:update", "签名更新失败");
        }
    }, {
        title: "更新签名"
    });
</script>

<template>
    <div class="space-banner">
        <user-avatar class="banner-avatar" :src="avatar"/>
        <div class="banner-title">
            <span class="banner-nickname">{{ nickname }}</span>
        </div>
        <input
            v-if="isMyself"
            class="text-truncate banner-sign"
            placeholder="在这里输入你的个性签名……"
            v-model="sign"
            @focus="recordSign"
            @blur="updateSign"
            @keyup.enter="($event.target as HTMLInputElement).blur()"
        />
        <span v-else class="text-truncate banner-sign">{{ sign }}</span>
    </div>
</template>

<style lang="scss" scoped>
    .space-banner {
        --mb: calc(-1 * var(--sotomi-padding));

        display: grid;
        grid-template:
            "A B"
            "A C" 1fr / auto 1fr;
        gap: 3px 24px;
        margin-bottom: var(--mb);
        padding: 16px 32px;
        border-radius: 0 0 16px 16px;
        box-shadow: var(--box-shadow);
        background-attachment: fixed;
        background-image: v-bind("headerUrl");
        background-position: 0 37.5%;
        background-size: cover;
        clip-path: inset(var(--scroll-banner) -4px -4px -4px);
        animation: scroll-banner linear both;
        animation-range: exit calc(var(--mb) - 64px) calc(100% + var(--mb) - 64px);
        animation-timeline: view();
        translate: 0 var(--mb);
    }

    @property --scroll-banner {
        syntax: "<percentage>";
        initial-value: 0%;
        inherits: false;
    }

    @keyframes scroll-banner {
        to {
            --scroll-banner: 100%;
        }
    }

    .banner-avatar {
        grid-area: A;
        width: 64px;
        border: 3px solid rgb(255 255 255 / 50%);
    }

    .banner-title {
        margin-top: 8px;
    }

    .banner-nickname {
        font-size: 18px;
        font-weight: bold;
        text-shadow: var(--text-shadow);
        color: white;
    }

    .banner-sign {
        margin: auto 0 auto -6px;
        padding-left: 6px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 26px;
        text-shadow: var(--text-shadow);
        color: rgb(255 255 255 / 80%);
        transition: all 0.4s;

        &:where(input):hover {
            box-shadow: 0 0 0 1px rgb(255 255 255 / 50%);
            background-color: rgb(255 255 255 / 20%);
        }

        &:focus {
            box-shadow: 0 2px 4px inset rgb(35 54 86 / 30%);
            background-color: var(--color-background);
            text-shadow: none;
            color: var(--color-text-primary);
        }
    }
</style>