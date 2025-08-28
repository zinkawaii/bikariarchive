import type { PickAsType } from "~/types";

export interface Setting {
    theme: number;
    "dark-mode": number;
    "sidebar-display": number;
    interaction: boolean;
    "ui-collapse": boolean;
}

export type SettingField<T = any> = keyof PickAsType<Setting, T>;
