<script lang="ts" setup>
    const toastStore = useToastStore();

    const oldVal = ref("");
    const newVal = ref("");
    const confirmVal = ref("");

    const { errors, glitch, validate } = useValidate({
        oldVal: {
            target: oldVal,
            required: true,
            ...passwordValidates
        },
        newVal: {
            target: newVal,
            required: true,
            ...passwordValidates
        },
        confirmVal: {
            target: confirmVal,
            required: true,
            exec(value) {
                if (value !== newVal.value) {
                    return "两次密码不一致";
                }
            }
        }
    });

    const { status, execute, data } = useLazyFetch("/api/user/password", {
        method: "put",
        body: {
            old: oldVal,
            new: newVal
        },
        watch: false,
        immediate: false
    });

    const updatePassword = Zin.debounce(async () => {
        if (!validate()) {
            return;
        }

        const key = "[password]:update";
        await execute();

        if (status.value !== "success") {
            toastStore.error(key, "密码修改失败");
            return;
        }

        switch (data.value.error) {
            case 1: {
                toastStore.error(key, "找不到用户");
                break;
            }
            case 2: {
                glitch("oldVal", "旧密码错误");
                break;
            }
            default: {
                toastStore.success(key, "密码已修改");
                oldVal.value = "";
                newVal.value = "";
                confirmVal.value = "";
            }
        }
    }, {
        title: "修改密码"
    });
</script>

<template>
    <div class="content-widget space-password">
        <meow-title>修改密码</meow-title>
        <meow-input
            type="password"
            placeholder="旧密码"
            v-model="oldVal"
            v-model:error="errors.oldVal"
        />
        <meow-input
            type="password"
            placeholder="新密码"
            v-model="newVal"
            v-model:error="errors.newVal"
        />
        <meow-input
            type="password"
            placeholder="确认密码"
            v-model="confirmVal"
            v-model:error="errors.confirmVal"
            @keyup.enter="updatePassword"
        />
        <div class="password-operator">
            <mb-button :disabled="status === `pending`" @click="updatePassword">提交</mb-button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .space-password {
        width: 240px;
        margin-inline: auto;
        padding: 16px var(--meow-medium);
        font-size: 14px;

        > .meow-input {
            margin-block: 24px 16px;
        }
    }

    .password-operator {
        display: flex;
        justify-content: flex-end;
    }
</style>