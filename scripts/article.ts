import { article, entry, update } from "../packages/article/src";

article.build();
entry.build();
update.build();

if (process.env.NODE_ENV === "development") {
    article.watch();
    entry.watch();
    update.watch();
}
