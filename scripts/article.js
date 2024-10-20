import { article, entry, update } from "@bikari/article";
import { isDev } from "@bikari/shared";

article.build();
entry.build();
update.build();

if (isDev) {
    article.watch();
    entry.watch();
    update.watch();
}