import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import * as p from "@clack/prompts";
import { resolve } from "pathe";
import YAML from "yaml";
import { $ } from "zx";

interface Resolver<T extends any[]> {
    (...args: T): Promise<{
        fileName: string;
        frontmatter: Record<string, unknown>;
        content?: string;
    } | void>;
}

export function defineCreator<T extends any[]>(resolver: Resolver<T>) {
    return async (...args: T) => {
        const returns = await resolver(...args);
        if (!returns) {
            return;
        }
        const { fileName, frontmatter, content } = returns;

        const path = resolveRoot(fileName);
        const text = `---\n${YAML.stringify(frontmatter)}---\n` + (
            content ? `${content}\n` : ""
        );

        if (existsSync(path)) {
            p.log.error(`文件 "${path}" 已存在！`);
        }
        else {
            await writeFile(path, text);
        }

        await $`code-insiders ${path}`;
    };
}

export function resolveRoot(path: string) {
    return resolve(import.meta.dirname, "../../.." + path);
}
