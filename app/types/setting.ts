export interface Settings {
    theme: number;
    "dark-mode": number;
    "sidebar-display": number;
    contextmenu: boolean;
    interaction: boolean;
    "ui-collapse": boolean;
}

export type SettingField<T = any> = keyof {
    [K in keyof Settings as Settings[K] extends T ? K : never]: void;
};
