import type { PickAsType } from "~/types";

export interface Setting {
    theme: number;
    "dark-mode": number;
    "sidebar-display": number;
    interaction: boolean;
    "shortcut-last": string;
    "shortcut-next": string;
    "font-family": number;
    "font-size": number;
    "ui-collapse": boolean;
}

export type SettingField = keyof Setting;
export type SettingBooleanField = keyof PickAsType<Setting, boolean>;