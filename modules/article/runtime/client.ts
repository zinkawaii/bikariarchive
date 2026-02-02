import jArticle from "~~/.data/json/article.json";
import jIntel from "~~/.data/json/intel.json";

const initialize = once(() => {
    enrichJArticle(jArticle as any);
    enrichJIntel(jIntel as any);
});

export default defineNuxtPlugin(() => {
    initialize();

    import.meta.hot?.accept("~~/.data/json/article.json", (mod) => {
        enrichJArticle(mod?.default);
    });
    import.meta.hot?.accept("~~/.data/json/intel.json", (mod) => {
        enrichJIntel(mod?.default);
    });
});

function once(func: () => void) {
    let called = false;
    return () => {
        if (called && import.meta.server) {
            return;
        }
        called = true;
        func();
    };
}
