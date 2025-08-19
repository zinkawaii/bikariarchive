import { joinURL } from "ufo";
import type { ProviderGetImage } from "@nuxt/image";

export const getImage: ProviderGetImage = (src, { baseUrl }) => {
    return {
        url: joinURL(baseUrl, src),
    };
};
