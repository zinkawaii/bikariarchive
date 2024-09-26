import type { WatchCallback, WatchOptions } from "vue";
import { ZSetting } from "#components";
import type { Setting, SettingBooleanField, SettingField } from "~/types/setting";

export const useSettingStore = defineStore("setting", () => {
    const setting = ref<Setting>({
        theme: 2,
        "dark-mode": 0,
        "sidebar-display": 0,
        "shortcut-last": "ArrowLeft",
        "shortcut-next": "ArrowRight",
        "font-family": 0,
        "font-size": 1,
        "novel-comment": true,
        "ui-collapse": false
    });

    const route = useRoute();
    const dialogStore = useDialogStore();

    //挂载弹窗实例
    const { open, close } = dialogStore.use(() => h(ZSetting), {
        unique: true
    });

    //是否为夜间模式
    const isDarkMode = computed(() => ({
        1: false,
        2: true
    }[setting.value["dark-mode"]] ?? (Zin.period === Zin.PERIOD_NIGHT)));

    //是否隐藏评论区
    const isCommentShow = computed(() => {
        return route.name !== "reader" || setting.value["novel-comment"];
    });

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
        isDarkMode,
        isCommentShow,
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