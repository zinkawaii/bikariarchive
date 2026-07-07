import type { WatchCallback } from "vue";
import { LazyZSetting } from "#components";
import type { SettingField, Settings } from "~/types/setting";

export const useSettingStore = defineStore("setting", () => {
  const settings = ref<Settings>({
    theme: 0,
    "dark-mode": 0,
    "aside-display": 0,
    contextmenu: false,
    interaction: true,
    "ui-collapse": false,
  });

  const modalStore = useModalStore();
  const isPreferredDark = usePreferredDark();

  // 挂载弹窗实例
  const { open, close } = modalStore.use(() => h(LazyZSetting), {
    unique: true,
  });

  // 主题名称
  const themeName = computed(() => {
    return {
      /* 初空 */ 0: "hatsusora",
      /* 菖蒲 */ 1: "ayame",
      /* 早樱 */ 2: "sakura",
    }[settings.value.theme];
  });

  // 是否为夜间模式
  const isDarkMode = computed(() => ({
    1: false,
    2: true,
  }[settings.value["dark-mode"]] ?? isPreferredDark.value));

  function get<K extends SettingField>(key: K) {
    return settings.value[key];
  }

  function set<K extends SettingField>(key: K, value: Settings[K]) {
    settings.value[key] = value;
  }

  function toggle<K extends SettingField<boolean>>(key: K, value?: Settings[K]) {
    settings.value[key] = value ?? !settings.value[key];
  }

  // 事件映射
  const mapping = new Map<string, {
    trigger: () => any;
    handlers: Set<WatchCallback>;
  }>();

  // 监听
  function listen<
    T extends Omit<Settings, "theme" | "dark-mode"> & {
      theme: string;
      "dark-mode": boolean;
    },
    K extends keyof T & string,
  >(key: K, handler: WatchCallback<T[K]>) {
    const handlers = mapping.get(key)?.handlers ?? new Set();
    handlers.add(handler);

    onUnmounted(() => {
      handlers.delete(handler);
    });

    if (!mapping.has(key)) {
      const source =
        key === "dark-mode" ? isDarkMode :
          key === "theme" ? themeName :
            () => settings.value[key as SettingField];

      const { trigger } = watchTriggerable(source, (newVal, oldVal, onCleanup) => {
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
        handlers,
      });
    }

    if (import.meta.browser) {
      mapping.get(key)!.trigger();
    }
  }

  return {
    settings,
    open,
    close,
    themeName,
    isDarkMode,
    get,
    set,
    toggle,
    listen,
  };
}, {
  persist: {
    pick: ["settings"],
  },
});
