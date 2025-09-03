import type { PickAsType } from "~/types";

export interface Settings {
    theme: number;
    "dark-mode": number;
    "sidebar-display": number;
    contextmenu: boolean;
    interaction: boolean;
    "ui-collapse": boolean;
}

export type SettingField<T = any> = keyof PickAsType<Settings, T>;
