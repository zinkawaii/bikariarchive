import { article, entry } from "@bikari/process";
import { isDev } from "@bikari/shared";

article.build();
entry.build();

if (isDev) {
    article.watch();
    entry.watch();
}