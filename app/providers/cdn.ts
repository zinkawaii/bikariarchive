import { defineProvider } from "@nuxt/image/runtime";
import { joinURL } from "ufo";

interface Options {
    baseUrl: string;
}

export default defineProvider<Options>({
    getImage(src, { baseUrl }) {
        return {
            url: joinURL(baseUrl, src),
        };
    },
});
