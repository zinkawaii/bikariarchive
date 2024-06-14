<script lang="ts" setup>
    import type { SettingField } from "~/types/setting";

    const settingStore = useSettingStore();

    //键值与显示值的映射表
    const shortMap = {
        " ": "SpaceBar",
        ArrowLeft: "←",
        ArrowUp: "↑",
        ArrowRight: "→",
        ArrowDown: "↓",
        Control: "Ctrl"
    };

    const shortcuts = ref({
        "shortcut-last": keyToStr(settingStore.get("shortcut-last")),
        "shortcut-next": keyToStr(settingStore.get("shortcut-next"))
    });

    //键盘按下时
    function onShortcutKeypress(name: string) {
        shortcuts.value[name] = "";
    }

    //键盘松开时
    function onShortcutKeyup(name: SettingField, event: KeyboardEvent) {
        shortcuts.value[name] = keyToStr(event.key);
        settingStore.set(name, event.key);
    }

    //键值 → 显示值
    function keyToStr(key: string) {
        let str = shortMap[key] || key;
        if (str.match(/^[a-z]$/)) {
            str = str.toUpperCase();
        }
        return str;
    }
</script>

<template>
    <mb-dialog class="z-setting" @close="settingStore.close()">
        <coco-title>全局设置</coco-title>
        <setting-form title="主题颜色" desc="仅在非夜间模式下生效" type="select" name="theme" :options="[`初空`, `菖蒲`, `早樱`]"/>
        <setting-form title="夜间模式" desc="每天早晚 6 点自动切换" type="select" name="dark-mode" :options="[`自动`, `白昼`, `暗夜`]"/>
        <setting-form title="侧栏显隐" desc="侧边栏是否跟随其他 UI 折叠" type="select" name="sidebar-display" :options="[`默认`, `显现`, `隐匿`]"/>
        <coco-title>快捷键设置</coco-title>
        <setting-form title="切换章节" type="input">
            <input
                v-for="(value, name) in shortcuts"
                class="setting-input"
                :value
                @keypress.stop="onShortcutKeypress(name)"
                @keyup.stop="onShortcutKeyup(name, $event)"
            />
        </setting-form>
        <coco-title>阅读设置</coco-title>
        <setting-form title="字体选择" type="select" name="font-family" :options="[`默认`, `宋体`, `楷体`]"/>
        <setting-form title="字体大小" type="select" name="font-size" :options="[`小`, `中`, `大`]"/>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .z-setting {
        width: 556px;

        @include viewport("xs") {
            height: 100dvh;
            padding: 16px;
            border-radius: 0;
        }
    }

    .setting-form {
        margin-top: 16px;

        + .coco-title {
            margin-top: 32px;
        }
    }

    .setting-input {
        flex: 1;
        text-align: center;
    }
</style>