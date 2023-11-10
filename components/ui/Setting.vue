<script setup>
    const settingStore = useSettingStore();
</script>

<template>
    <Transition name="slide-fade">
        <div v-if="settingStore.isOpen" class="z-setting">
            <i class="fas fa-xmark" id="Close" @click="settingStore.close()"></i>
            <span class="content-h2 coco-title">全局设置</span>
            <mb-form title="主题颜色" type="select" name="theme" :list="[`初空`, `菖蒲`, `早樱`]"/>
            <mb-form title="夜间模式" type="select" name="dark-mode" :list="[`自动`, `白昼`, `暗夜`]"/>
            <mb-form title="边栏显隐" type="select" name="sidebar-display" :list="[`默认`, `显现`, `隐匿`]"/>
            <span class="content-h2 coco-title">快捷键设置</span>
            <div class="shortcut-box">
                <mb-form title="上一章节" type="input">
                    <input class="input-line" id="ShortCut-Last" value="A">
                </mb-form>
                <mb-form title="下一章节" type="input">
                    <input class="input-line" id="ShortCut-Next" value="D">
                </mb-form>
            </div>
            <span class="content-h2 coco-title">阅读设置</span>
            <mb-form title="字体选择" type="select" name="font-family" :list="[`系统默认`, `宋体`, `楷体`]"/>
            <mb-form title="字体大小" type="select" name="font-size" :list="[`小`, `中`, `大`]"/>
        </div>
    </Transition>
    <mb-mask :when="settingStore.isOpen" z="511" @click="settingStore.close()"/>
</template>

<style lang="scss" scoped>
    .z-setting {
        position: fixed;
        inset: 0;
        width: min(100%, 512px);
        max-height: fit-content;
        margin: auto;
        padding: 32px;
        border-radius: 16px;
        background-color: var(--color-background);
    }

    .slide-fade-enter-active, .slide-fade-leave-active {
        transition: all 0.4s;
    }

    .slide-fade-enter-from, .slide-fade-leave-to {
        opacity: 0;
        translate: 0 -50%;
    }

    #Close {
        position: absolute;
        top: 0.5em;
        right: 0.5em;
        width: 1em;
        font-size: 32px;
        color: rgb(196 196 196);
        transition: rotate 0.25s;
        cursor: pointer;

        &:hover {
            rotate: 360deg;
        }
    }

    .shortcut-box {
        display: flex;
        gap: 32px;
    }

    .input-line {
        width: 100%;
        text-align: center;
    }

    @media (width < 425px) {
        :host {
            height: 100vh;
            padding: 16px;
            border-radius: 0;
        }
    }
</style>