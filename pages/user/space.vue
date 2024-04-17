<script setup>
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const sign = ref(userStore.sign);
    const oldSign = ref();

    //UID校验
    if (userStore.uid !== Number(route.params.uid)) {
        router.replace({ name: "unknown" });
    }

    //设置标题
    useHead({
        title: `${userStore.nickname}的个人空间`
    });

    //更新签名
    const updateSign = Zin.debounce(() => {
        if (sign.value === oldSign.value) return;

        Zjax.put("/api/user/sign", {
            body: {
                content: sign.value
            }
        })
        .then((res) => {
            if (!res.error) {
                userStore.sign = sign.value;
            }
        });
    }, {
        title: "更新签名"
    });
</script>

<template>
    <div class="space-header">
        <mb-image class="space-icon" src="/garden/icon/default.png" :alt="userStore.nickname"/>
        <div class="space-title">
            <span class="space-nickname">{{ userStore.nickname }}</span>
        </div>
        <input
            class="space-sign"
            placeholder="在这里输入你的个性签名……"
            v-model="sign"
            @focus="oldSign = sign"
            @blur="updateSign"
            @keyup.enter="$event.target.blur()"
        />
    </div>
</template>

<style lang="scss" scoped>
    .space-header {
        --s: -32px;

        display: grid;
        grid-template:
            "A B"
            "A C" 1fr / auto 1fr;
        gap: 3px 24px;
        margin-bottom: var(--s);
        padding: 16px 32px;
        border-radius: 0 0 16px 16px;
        box-shadow: var(--box-shadow);
        background-attachment: fixed;
        background-image: url("/garden/background/space_header.webp");
        background-position: 0 37.5%;
        background-size: cover;
        translate: 0 var(--s);
    }

    .space-icon {
        grid-area: A;
        width: 64px;
        border: 3px solid rgb(255 255 255 / 50%);
        border-radius: 100%;
    }

    .space-title {
        margin-top: 8px;
    }

    .space-nickname {
        font-size: 18px;
        font-weight: bold;
        text-shadow: var(--text-shadow);
        color: white;
    }

    .space-sign {
        width: 100%;
        height: 25px;
        margin-left: -4px;
        padding-left: 4px;
        border: 0;
        border-radius: 4px;
        background-color: transparent;
        font-size: 14px;
        color: rgb(255 255 255 / 80%);
        transition: all 0.4s;

        &:hover {
            box-shadow: 0 0 0 1px rgb(255 255 255 / 50%);
            background-color: rgb(255 255 255 / 20%);
        }

        &:focus {
            box-shadow: 0 2px 4px inset rgb(35 54 86 / 30%);
            background-color: var(--color-background);
            color: var(--color-text-primary);
        }
    }

    @media (width < 1024px) {
        .space-header {
            --s: -16px;
        }
    }
</style>