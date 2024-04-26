<script lang="ts" setup>
    const confirmStore = useConfirmStore();

    //添加遮罩层
    useMask({
        isOpened: () => confirmStore.isOpened,
        onClick: () => res(false)
    });

    //键盘监听
    useEventListener("keyup", (event) => {
        if (confirmStore.isOpened) {
            switch (event.key) {
                case "Escape":
                    return res(false);
                case "Enter":
                    return res(true);
            }
        }
    });

    //返回判断结果
    function res(state: boolean) {
        confirmStore.hide(state);
    }
</script>

<template>
    <transition-scale>
        <div v-if="confirmStore.isOpened" class="mb-confirm">
            <div class="confirm-content">{{ confirmStore.content }}</div>
            <div class="confirm-button-group">
                <mb-button @click="res(false)">取消</mb-button>
                <mb-button @click="res(true)">确定</mb-button>
            </div>
        </div>
    </transition-scale>
</template>

<style lang="scss" scoped>
    .mb-confirm {
        position: fixed;
        inset: 0;
        width: fit-content;
        height: fit-content;
        margin: auto;
        padding: 1em;
        border: 2px solid var(--color-theme-dark);
        border-radius: 8px;
        background-color: var(--color-background-alpha);
        font-size: 14px;
    }

    .confirm-content {
        margin-bottom: 8px;
        line-height: 24px;
        text-align: center;
    }

    .confirm-button-group {
        display: flex;
        justify-content: center;
        gap: 8px;

        > button {
            flex: 1;
            width: 96px;
        }
    }
</style>