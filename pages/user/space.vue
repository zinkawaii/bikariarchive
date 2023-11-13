<script setup>
    const route = useRoute();
    const router = useRouter();
    const userStore = useUserStore();

    const sign = ref(userStore.sign);
    const sign_old = ref();

    //UID校验
    if (userStore.uid !== Number(route.params.uid)) {
        router.replace({ name: "unknown" });
    }

    //设置标题
    useHead({
        title: `${userStore.nickname}的个人空间`
    });

    //更新签名
    const signUpdate = Zin.debounce(() => {
        if (sign.value === sign_old.value) return;

        Zjax.post({
            url: "/api/user/sign",
            data: {
                content: sign.value
            }
        });
    });
</script>

<template>
    <div class="space-header">
        <img class="space-icon" src="/garden/icon/default.png"/>
        <div class="space-title">
            <div>
                <span class="space-nickname">{{ userStore.nickname }}</span>
            </div>
            <input class="space-sign" placeholder="在这里输入你的个性签名……"
                v-model="sign"
                @focus="sign_old = sign"
                @blur="signUpdate"
                @keyup.enter="$event.target.blur()"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .space-header {
        --s: -32px;

        display: flex;
        margin: 0 0 var(--s);
        padding: 16px 32px;
        border-bottom-right-radius: 16px;
        border-bottom-left-radius: 16px;
        box-shadow: var(--box-shadow);
        background-attachment: fixed;
        background-image: url("/garden/background/space_header.webp");
        background-position: 0 37.5%;
        background-size: cover;
        translate: 0 var(--s);
    }

    .space-icon {
        display: inline-block;
        width: 64px;
        border: 3px solid rgb(255 255 255 / 50%);
        border-radius: 100%;
    }

    .space-title {
        flex: 1;
        margin: 6px 0 6px 24px;
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
        margin: 4px 0 0 -4px;
        padding: 0 0 0 4px;
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
            color: var(--color-text);
        }

        &::placeholder,
        &:-webkit-input-placeholder {
            color: rgb(214 222 228);
        }
    }

    @media (width < 1024px) {
        .space-header {
            --s: -8px;
        }
    }
</style>