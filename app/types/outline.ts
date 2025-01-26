export interface OutlineHeaderItem {
    element: HTMLHeadingElement;
    title: string;
    link: string;
    level: number;
    order: string;
    children: OutlineHeaderItem[];
}