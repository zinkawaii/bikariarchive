import { defineProvider } from "@nuxt/image/runtime";
import { joinURL, withQuery } from "ufo";

export default defineProvider({
    getImage(src, { modifiers }) {
        return {
            url: withQuery(joinURL("/api/image", src), {
                fmt: modifiers.format,
                q: modifiers.quality,
                w: modifiers.width,
                h: modifiers.height,
            }),
        };
    },
});
