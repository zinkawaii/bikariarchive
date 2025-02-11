import type { WatchCallback } from "vue";
import { LazyZSetting } from "#components";
import type { Setting, SettingField } from "~/types/setting";

export const useSettingStore = defineStore("setting", () => {
    const setting = ref<Setting>({
        theme: 0,
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
    const { open, close } = dialogStore.use(() => h(LazyZSetting), {
        unique: true
    });

    //主题名称
    const themeName = computed(() => {
        return {
            /* 初空 */ 0: "hatsusora",
            /* 抹茶 */ 1: "ayame",
            /* 早樱 */ 2: "sakura"
        }[setting.value.theme];
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

    function toggle<K extends SettingField<boolean>>(key: K, value?: Setting[K]) {
        setting.value[key] = value ?? !setting.value[key];
    }

    //事件映射
    const mapping = new Map<string, {
        trigger: () => any;
        handlers: Set<WatchCallback>;
    }>();

    //监听
    function listen<K extends SettingField>(key: K, handler: WatchCallback<Setting[K]>) {
        const handlers = mapping.get(key)?.handlers ?? new Set();
        handlers.add(handler);

        onUnmounted(() => {
            handlers.delete(handler);
        });

        if (!mapping.has(key)) {
            const { trigger } = watchTriggerable(() => setting.value[key], (newVal, oldVal, onCleanup) => {
                if (oldVal !== void 0) {
                    document.startViewTransition?.(fn) ?? fn();
                }
                else fn();

                function fn() {
                    for (const handler of handlers) {
                        handler(newVal, oldVal, onCleanup);
                    }
                }
            });

            mapping.set(key, {
                trigger,
                handlers
            });
        }

        if (import.meta.browser) {
            mapping.get(key)!.trigger();
        }
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