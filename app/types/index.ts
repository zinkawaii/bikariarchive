declare module "#app" {
  interface PageMeta {
    identity?: number;
    catalog?: boolean;
    comment?: boolean;
    jumbotron?: boolean;
    sidebar?: boolean;
    widePage?: boolean;
    fullPage?: boolean;
  }
}

declare module "@unhead/vue" {
  interface HtmlAttr {
    theme?: string;
    "z-dark"?: boolean;
  }
}
