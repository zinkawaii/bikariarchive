import DOMPurify from "dompurify";
import { Marked } from "marked";
import Prism from "prismjs";
import "prismjs/components/prism-yaml";

const purifyOptions: DOMPurify.Config = {
    ALLOWED_TAGS: [
        "br"
    ],
    ALLOWED_ATTR: []
};

const zmark = new Marked({
    renderer: {
        code(code, infostring) {
            let html = code;
            if (infostring in Prism.languages) {
                html = Prism.highlight(code, Prism.languages[infostring], infostring);
            }

            return `<pre>\`\`\`${infostring}\n${html}\n\`\`\`</pre>`;
        }
    },
    breaks: true
});

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive("marked", {
        mounted(el, binding) {
            const sanitized = DOMPurify.sanitize(binding.value, purifyOptions) as string;
            const html = zmark.parse(sanitized) || `<p class="sanitized">好像说了什么，但是被清除了</p>`;
            el.innerHTML = html;
        }
    });
});