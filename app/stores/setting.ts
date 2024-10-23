import type { WatchCallback, WatchOptions } from "vue";
import { ZSetting } from "#components";
import type { Setting, SettingBooleanField, SettingField } from "~/types/setting";

export const useSettingStore = defineStore("setting", () => {
    const setting = ref<Setting>({
        theme: 2,
        "dark-mode": 0,
        "sidebar-display": 0,
        interaction: true,
        "shortcut-last": "ArrowLeft",
        "shortcut-next": "ArrowRight",
        "font-family": 0,
        "font-size": 1,
        "ui-collapse": false
    });

    const dialogStore = useDialogStore();

    //挂载弹窗实例
    const { open, close } = dialogStore.use(() => h(ZSetting), {
        unique: true
    });

    //主题名称
    const themeName = computed(() => {
        return {
            /* 初空 */ 0: "hatsusora",
            /* 抹茶 */ 1: "ayame"
        }[setting.value.theme] ||
            /* 早樱 */ "sakura";
    });

    //是否为夜间模式
    const isDarkMode = computed(() => ({
        1: false,
        2: true
    }[setting.value["dark-mode"]] ?? (Zin.period === Zin.PERIOD_NIGHT)));

    function get<K extends SettingField>(key: K) {
        return setting.value[key];
    }

    function set<K extends SettingField>(key: K, value: Setting[K]) {
        setting.value[key] = value;
    }

    function toggle<K extends SettingBooleanField>(key: K, value?: Setting[K]) {
        setting.value[key] = value ?? !setting.value[key];
    }

    //监听
    function listen<K extends SettingField>(key: K, handler: WatchCallback<Setting[K]>, options: WatchOptions & {
        viewTransition?: boolean;
    } = {}) {
        watch(() => setting.value[key], (newVal, oldVal, onCleanup) => {
            const fn = handler.bind(null, newVal, oldVal, onCleanup);

            if (/* 首屏加载时不应用视图转换 */
                oldVal !== void 0
                && options?.viewTransition
                && document.startViewTransition
            ) {
                document.startViewTransition(fn);
            }
            else fn();
        }, {
            immediate: import.meta.browser,
            ...options
        });
    }

    return {
        setting,
        open,
        close,
        themeName,
        isDarkMode,
        get,
        set,
        toggle,
        listen
    };
}, {
    persist: {
        pick: ["setting"]
    }
});