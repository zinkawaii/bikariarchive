<script setup>
    const settingStore = useSettingStore();

    //添加遮罩层
    useMask({
        isOpened: () => settingStore.isOpened,
        onClick: () => settingStore.close()
    });

    //键值与显示值的映射表
    const ShortMap = new Map([
        ["Control",    "Ctrl"],
        [" ",          "SpaceBar"],
        ["ArrowLeft",  "←"],
        ["ArrowUp",    "↑"],
        ["ArrowRight", "→"],
        ["ArrowDown",  "↓"]
    ]);

    const shortcuts = ref({
        "shortcut-last": keyToStr(settingStore.get("shortcut-last")),
        "shortcut-next": keyToStr(settingStore.get("shortcut-next"))
    });

    //键盘按下时
    function onShortcutKeypress(name) {
        shortcuts.value[name] = "";
    }

    //键盘松开时
    function onShortcutKeyup(name, event) {
        shortcuts.value[name] = keyToStr(event.key);
        settingStore.set(name, event.key);
    }

    //键值 → 显示值
    function keyToStr(key) {
        let str = ShortMap.get(key) || key;
        if (str.match(/^[a-z]{1}$/)) {
            str = str.toUpperCase();
        }
        return str;
    }
</script>

<template>
    <transition name="slide-fade">
        <div v-if="settingStore.isOpened" class="z-setting">
            <fa-icon class="xmark" icon="xmark" @click="settingStore.close()"/>
            <coco-title>全局设置</coco-title>
            <setting-form title="主题颜色" desc="仅在非夜间模式下生效" type="select" name="theme" :options="[`初空`, `菖蒲`, `早樱`]"/>
            <setting-form title="夜间模式" desc="每天早晚 6 点自动切换" type="select" name="dark-mode" :options="[`自动`, `白昼`, `暗夜`]"/>
            <setting-form title="边栏显隐" desc="侧边栏是否跟随其他 UI 折叠" type="select" name="sidebar-display" :options="[`默认`, `显现`, `隐匿`]"/>
            <coco-title>快捷键设置</coco-title>
            <setting-form title="切换章节" type="input">
                <input
                    v-for="(value, name) in shortcuts"
                    class="input-line"
                    :value="value"
                    @keypress.stop="onShortcutKeypress(name)"
                    @keyup.stop="onShortcutKeyup(name, $event)"
                />
            </setting-form>
            <coco-title>阅读设置</coco-title>
            <setting-form title="字体选择" type="select" name="font-family" :options="[`默认`, `宋体`, `楷体`]"/>
            <setting-form title="字体大小" type="select" name="font-size" :options="[`小`, `中`, `大`]"/>
        </div>
    </transition>
</template>

<style lang="scss" scoped>
    .z-setting {
        position: fixed;
        inset: 0;
        width: min(100%, 556px);
        height: fit-content;
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
        translate: 0 -25%;
    }

    .mb-form {
        margin-top: 16px;

        + h2 {
            margin-top: 32px;
        }
    }

    .input-line {
        width: 100%;
        text-align: center;
    }

    @media (width < 425px) {
        .z-setting {
            height: 100vh;
            padding: 16px;
            border-radius: 0;
        }
    }
</style>