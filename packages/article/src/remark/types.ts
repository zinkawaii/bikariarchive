export interface Root {
    type: "root";
    children: Child[];
}

export interface Element {
    type: "element";
    tag: string;
    props: Record<string, any>;
    children: Child[];
}

export interface Text {
    type: "text";
    value: string;
}

export type Child = Element | Text;
