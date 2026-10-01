import { defineEventHandler, useRuntimeConfig } from "nuxt/server";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import Template from "./template.vue";

export default defineEventHandler(async (event) => {
  event.res.headers.set("content-type", "application/xml");
  event.res.headers.set("cache-control", (60 * 15).toString());

  const config = useRuntimeConfig();
  const app = createSSRApp(Template, {
    tagline: config.public.motto,
  });

  return [
    `<?xml version="1.0"?>\n`,
    `<?xml-stylesheet type="text/xsl" href="/feed/template.xsl"?>\n`,
  ].join("") + await renderToString(app);
});
