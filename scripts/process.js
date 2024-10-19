import { article, entry } from "@bikari/article";
import { isDev } from "@bikari/shared";

article.build();
entry.build();

if (isDev) {
    article.watch();
    entry.watch();
}