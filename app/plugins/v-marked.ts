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
        const shiki = await getShikiHighlighter();
        try {
            await loadShikiLanguages(shiki, token.lang);
        }
        catch (err) {
            console.error(err);
            return;
        }
        token.text = shiki.highlight(token.text, { lang: token.lang, ...highlightOptions });
    },
    renderer: {
        link(token) {
            return `<a class="plain-link" href=${token.href} rel="noopener noreferrer nofollow" target="_blank">${token.text}</a>`;
        },
        code(token) {
            return `<pre class="shiki">\`\`\`${token.lang}\n${token.text}\n\`\`\`</pre>`;
        }
    },
    async: true,
    breaks: true,
    useNewRenderer: true
});

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("marked", async (el, binding) => {
        el.innerHTML = `<p class="sanitized">好像说了什么，但是被清除了</p>`;

        const sanitized = DOMPurify.sanitize(binding.value, purifyOptions) as string;
        const html = await zmark.parse(sanitized);
        if (html.length) {
            el.innerHTML = html;
        }
    });
});