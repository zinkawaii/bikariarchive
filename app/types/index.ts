declare module "#app" {
  interface PageMeta {
    identity?: number;
    aside?: boolean;
    comment?: boolean;
    jumbotron?: {
      height: number;
      hero?: boolean;
      image?: string;
    };
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
