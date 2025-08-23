import type { PickAsType } from "~/types";

export interface Setting {
    theme: number;
    "dark-mode": number;
    "sidebar-display": number;
    interaction: boolean;
    "shortcut-last": string;
    "shortcut-next": string;
    "font-size": number;
    "ui-collapse": boolean;
}

export type SettingField<T = any> = keyof PickAsType<Setting, T>;
