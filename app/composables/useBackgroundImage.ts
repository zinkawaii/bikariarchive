import type { ImageOptions } from "@nuxt/image";

export default function(source: string, options: ImageOptions = {}) {
    const image = useImage();
    return `url(${image(source, options.modifiers, options)})`;
}