import type { Article } from "~/utils/Article";

export interface BikariHooks {
    "page:reader:rendered": () => void;
}