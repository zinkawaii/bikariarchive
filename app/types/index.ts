declare module "#app" {
  interface PageMeta {
    identity?: number;
    comment?: boolean;
    jumbotron?: boolean;
    aside?: boolean;
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
