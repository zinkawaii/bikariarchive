export interface OutlineHeaderItem {
    element: HTMLHeadingElement;
    title: string;
    link: string;
    level: number;
    children: OutlineHeaderItem[];
}