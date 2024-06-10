export interface Setting {
    theme: number;
    "dark-mode": number;
    "sidebar-display": number;
    "shortcut-last": string;
    "shortcut-next": string;
    "font-family": number;
    "font-size": number;
    "ui-collapse": boolean;
}

export type SettingField = keyof Setting;