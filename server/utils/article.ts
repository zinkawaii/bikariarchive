import { useStorage } from "nitro/storage";
import type { Root } from "@bikari/article";
import { Article } from "#shared/utils/article";

export async function readArticle(art: Article) {
    const { novel, volume, index } = art;
    const storage = useStorage("assets:data");
    const key = `novel/${novel}.${volume}/${Article.map[novel][index].name}.json`;
    const root = await storage.getItem(key) as Root;
    return root;
}
