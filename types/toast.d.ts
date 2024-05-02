export type ToastType = "error" | "info" | "success";

export interface ToastIconInfo {
    name: string;
    color: string;
}

export interface ToastItem {
    icon: ToastIconInfo;
    content: string;
}