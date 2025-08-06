import jArticle from "~~/.data/json/Article.json";
import jIntel from "~~/.data/json/Intel.json";

const initialize = once(() => {
    enrichJArticle(jArticle as any);
    enrichJIntel(jIntel as any);
});

export default defineNuxtPlugin(() => {
    initialize();

    if (import.meta.hot) {
        import.meta.hot.accept("../../../.data/json/Article.json", (mod) => {
            enrichJArticle(mod?.default);
        });
        import.meta.hot.accept("../../../.data/json/Intel.json", (mod) => {
            enrichJIntel(mod?.default);
        });
    }
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
