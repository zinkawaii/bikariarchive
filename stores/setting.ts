import type { WatchCallback, WatchOptions } from "vue";
import type { PickAsType } from "~/types";
import type { Setting, SettingField } from "~/types/setting";

export const useSettingStore = defineStore("setting", () => {
    const isOpened = ref(false);
    const setting = ref<Setting>({
        theme: 2,
        "dark-mode": 0,
        "sidebar-display": 0,
        "shortcut-last": "ArrowLeft",
        "shortcut-next": "ArrowRight",
        "font-family": 0,
        "font-size": 1,
        "ui-collapse": false
    });

    //是否为夜间模式
    const isDarkMode = computed(() => ({
        1: false,
        2: true
    }[setting.value["dark-mode"]] ?? (Zin.period === Zin.PERIOD_NIGHT)));

    function get<K extends SettingField>(key: K) {
        return setting.value[key];
    }

    function set<K extends SettingField, V extends Setting[K]>(key: K, value: V) {
        setting.value[key] = value;
    }

    function toggle<K extends keyof PickAsType<Setting, boolean>, V extends Setting[K]>(key: K, value?: V) {
        setting.value[key] = value ?? !setting.value[key];
    }

    //监听
    function listen(key: string, handler: WatchCallback, options: WatchOptions & {
        viewTransition: boolean;
    }) {
        watchImmediate(() => setting.value[key], (newVal, oldVal, onCleanup) => {
            const fn = handler.bind(null, newVal, oldVal, onCleanup);

            if (//首屏加载时不应用视图转换
                oldVal !== void 0
                && import.meta.browser
                && options?.viewTransition
                && document.startViewTransition
            ) {
                document.startViewTransition(fn);
            }
            else fn();
        }, options);
    }

    //打开设置
    function open() {
        isOpened.value = true;
    }

    //关闭设置
    function close() {
        isOpened.value = false;
    }

    return {
        isOpened,
        setting,
        isDarkMode,
        get,
        set,
        toggle,
        listen,
        open,
        close
    };
}, {
    persist: {
        paths: ["setting"]
    }
});