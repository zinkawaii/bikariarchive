<script lang="ts" setup>
    import type { SettingField } from "~/types/setting";

    type ShortCutKey = Extract<SettingField, `shortcut-${string}`>;

    const settingStore = useSettingStore();

    //键值与显示值的映射表
    const shortMap: Record<string, string> = {
        " ": "SpaceBar",
        ArrowLeft: "←",
        ArrowUp: "↑",
        ArrowRight: "→",
        ArrowDown: "↓",
        Control: "Ctrl",
    };

    const shortcuts = ref({
        "shortcut-last": {
            title: "上一章",
            value: keyToStr(settingStore.get("shortcut-last")),
        },
        "shortcut-next": {
            title: "下一章",
            value: keyToStr(settingStore.get("shortcut-next")),
        },
    });

    //键盘按下时
    function onShortcutKeypress(name: ShortCutKey) {
        shortcuts.value[name].value = "";
    }

    //键盘松开时
    function onShortcutKeyup(name: ShortCutKey, event: KeyboardEvent) {
        shortcuts.value[name].value = keyToStr(event.key);
        settingStore.set(name, event.key);
    }

    //键值 → 显示值
    function keyToStr(key: string) {
        let str = shortMap[key] ?? key;
        if (str.match(/^[a-z]$/)) {
            str = str.toUpperCase();
        }
        return str;
    }
</script>

<template>
    <mb-dialog class="z-setting" @close="settingStore.close()">
        <meow-title>全局设置</meow-title>
        <setting-form title="主题颜色" desc="仅在非夜间模式下生效">
            <setting-select name="theme" :options="[`初空`, `菖蒲`, `早樱`]"/>
        </setting-form>
        <setting-form title="夜间模式" desc="每天早晚 6 点自动切换">
            <setting-select name="dark-mode" :options="[`自动`, `白昼`, `暗夜`]"/>
        </setting-form>
        <setting-form title="侧栏显隐" desc="侧边栏是否跟随其他 UI 折叠">
            <setting-select name="sidebar-display" :options="[`默认`, `显现`, `隐匿`]"/>
        </setting-form>
        <setting-form title="交互模块" desc="是否开启评论区等交互功能">
            <setting-switch name="interaction"/>
        </setting-form>
        <meow-title>快捷键设置</meow-title>
        <setting-form title="切换章节" type="input">
            <div class="setting-input">
                <meow-input
                    v-for="{ title, value }, name in shortcuts"
                    class="setting-input"
                    :value
                    :placeholder="title"
                    @keypress.stop="onShortcutKeypress(name)"
                    @keyup.stop="onShortcutKeyup(name, $event)"
                />
            </div>
        </setting-form>
        <meow-title>阅读设置</meow-title>
        <setting-form title="字体选择">
            <setting-select name="font-family" :options="[`默认`, `宋体`, `楷体`]"/>
        </setting-form>
        <setting-form title="字体大小">
            <setting-select name="font-size" :options="[`小`, `中`, `大`]"/>
        </setting-form>
    </mb-dialog>
</template>

<style lang="scss" scoped>
    .z-setting {
        width: 556px;

        @include viewport("xs") {
            --dialog-padding: 16px;

            height: 100dvh;
            border-radius: 0;
        }
    }

    .setting-form {
        margin-top: 16px;

        + .meow-title {
            margin-top: 32px;
        }
    }

    .setting-input {
        display: flex;
        gap: 16px;
    }
</style>
