export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook("shiki:options", (ctx) => {
        ctx.extend({
            defaultColor: false,
            transformers: [{
                root: (hast) => ({
                    type: "root",
                    children: (hast.children[0] as any).children[0].children
                })
            }]
        });
    });
});