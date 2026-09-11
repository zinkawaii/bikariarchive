export interface Config {
  components?: string[];
  mappings: Mapping[];
}

export interface Mapping {
  name: string;
  patterns: string[];
  components?: string[];
}

export function defineConfig(config: Config) {
  return config;
}
