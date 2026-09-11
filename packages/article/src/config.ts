export interface Config {
  components?: string[];
  macros: Record<string, any>;
  mappings: Mapping[];
}

export interface Mapping {
  name: string;
  patterns: string[];
  components?: string[];
}

export function defineConfig<T extends Config>(config: T) {
  return config;
}
