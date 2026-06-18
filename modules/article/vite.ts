import { parsePath, parseQuery } from "ufo";
import type { Plugin } from "vite";
import { parseArticle } from "../../packages/article/src/remark";

export default <Plugin> {
  name: "@bikari/article",
  transform: {
    filter: {
      id: /\.vue\?vue&type=article(&[^&]+)*&lang\.md$/,
    },
    async handler(code, id) {
      const { search } = parsePath(id);
      const { name = "default" } = parseQuery(search);
      const { body } = await parseArticle(code);

      return {
        code: /* TS */`
export default function(comp) {
    (comp.articles ??= {})["${name}"] = ${JSON.stringify(body.children)};
    (comp.computed ??= {}).$articles ??= () => comp.articles;
}
`.trimStart(),
        moduleType: "js",
      };
    },
  },
};
