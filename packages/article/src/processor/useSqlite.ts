import { join } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { type Connector, createDatabase, type Database } from "db0";
import sqlite from "db0/connectors/node-sqlite";
import { useCurrentContext } from "./kerria.ts";

export interface SqliteContext {
  database: Database<Connector<DatabaseSync>>;
  prepares: ((instance: DatabaseSync) => void)[];
  ready: () => Promise<DatabaseSync>;
}

export function createSqliteContext(base: string): SqliteContext {
  const context: SqliteContext = {
    database: createDatabase(
      sqlite({
        path: join(base, "content/generated/kerria.sqlite"),
      }),
    ),
    prepares: [],
    ready: once(async () => {
      const instance = await context.database.getInstance();
      for (const prepare of context.prepares) {
        prepare(instance);
      }
      return instance;
    }),
  };

  return context;
}

export function prepareSqlite(prepare: (instance: DatabaseSync) => void) {
  const ctx = useCurrentContext();

  ctx.sqlite!.prepares.push(prepare);
  return ctx.sqlite!.ready;
}

export function useSqlite() {

}

function once<R>(func: () => R) {
  let returns: R;

  return () => {
    returns ??= func();
    return returns;
  };
}
