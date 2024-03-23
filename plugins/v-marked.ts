import DOMPurify from "dompurify";
import { Marked } from "marked";

const purifyOptions: DOMPurify.Config = {
    ALLOWED_TAGS: [
        "br"
    ],
    ALLOWED_ATTR: []
};

const zmark = new Marked({
    async walkTokens(token) {
        if (token.type !== "code") return;
        const codeRef = await useHighlighted(token.text, { lang: token.lang, ...highlightOptions });
        token.text = codeRef.value || await until(codeRef).changed();
    },
    renderer: {
        code(code, infostring) {
            return `<pre class="shiki">\`\`\`${infostring}\n${code}\n\`\`\`</pre>`;
        }
    },
    async: true,
    breaks: true
});

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("marked", {
        async beforeMount(el, binding) {
            el.innerHTML = `<p class="sanitized">好像说了什么，但是被清除了</p>`;

            const sanitized = DOMPurify.sanitize(binding.value, purifyOptions) as string;
            const html = await zmark.parse(sanitized);
            if (html.length) {
                el.innerHTML = html;
            }
        }
    });
});