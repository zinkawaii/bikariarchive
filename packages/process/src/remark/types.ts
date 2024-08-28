export interface Root {
    type: "root";
    children: Element[];
}

export interface Element {
    type: "element";
    tag: string;
    props: Record<string, any>;
    children: (Element | Text)[];
}

export interface Text {
    type: "text";
    value: string;
}