import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname } from "pathe";

export type MaybePromise<T> = T | Promise<T>;

export function capitalize(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function readJsonSync<T>(path: string) {
  const data = readFileSync(path, "utf-8");
  return JSON.parse(data) as T;
}

export function writeJson(path: string, data: any) {
  mkdirSync(dirname(path), { recursive: true });
  const json = JSON.stringify(data);
  return writeFile(path, json);
}

export function writeJsonSync(path: string, data: any) {
  mkdirSync(dirname(path), { recursive: true });
  const json = JSON.stringify(data);
  return writeFileSync(path, json);
}
