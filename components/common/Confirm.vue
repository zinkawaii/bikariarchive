<script setup>
    const confirmStore = useConfirmStore();

    //键盘监听
    useEventListener("keyup", (event) => {
        if (confirmStore.isShow) {
            switch (event.key) {
                case "Escape":
                    return res(false);
                case "Enter":
                    return res(true);
            }
        }
    });

    //返回判断结果
    function res(state) {
        confirmStore.hide(state);
    }
</script>

<template>
    <transition name="slide-fade">
        <div v-if="confirmStore.isShow" class="mb-confirm">
            <div class="confirm-content">{{ confirmStore.content }}</div>
            <div class="confirm-button-group">
                <a class="btn" @click="res(false)">取消</a>
                <a class="btn" @click="res(true)">确定</a>
            </div>
        </div>
    </transition>
    <mb-mask :when="confirmStore.isShow" z="511" @click="res(false)"/>
</template>

<style lang="scss" scoped>
    .mb-confirm {
        position: fixed;
        inset: 0;
        width: fit-content;
        height: fit-content;
        margin: auto;
        padding: 1em;
        border: 2px solid var(--color-theme-block-dark);
        border-radius: 8px;
        background-color: var(--color-background-alpha);
        font-size: 14px;
    }

    .slide-fade-enter-active, .slide-fade-leave-active {
        transition: all 0.4s;
    }

    .slide-fade-enter-from, .slide-fade-leave-to {
        opacity: 0;
        translate: 0 -100%;
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

        > a {
            flex: 1;
            width: 96px;
        }
    }
</style>