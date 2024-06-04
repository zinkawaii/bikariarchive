<script lang="ts" setup>
    const confirmStore = useConfirmStore();

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
    <mb-dialog class="mb-confirm" v-model="confirmStore.isOpened" @close="res(false)">
        <coco-title>确认</coco-title>
        <p class="confirm-content">{{ confirmStore.content }}</p>
        <div class="confirm-operator">
            <mb-button @click="res(false)">取消</mb-button>
            <mb-button @click="res(true)">确定</mb-button>
        </div>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .mb-confirm {
        max-width: 720px;
        padding: 1rem 1.5rem;
        font-size: 14px;

        @include viewport("xs") {
            width: 100%;
            height: fit-content;
        }
    }

    .confirm-content {
        margin-block: 8px 24px;
        line-height: 24px;
    }

    .confirm-operator {
        display: flex;
        justify-content: right;
        gap: 8px;

        > .mb-button {
            width: 96px;
        }
    }
</style>