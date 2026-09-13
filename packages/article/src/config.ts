export interface Config {
  components?: string[];
  macros: Record<string, any>;
  mappings: Mapping[];
}

export interface Mapping {
  name: string;
  patterns: string[];
  components?: string[];
  frontmatter: Record<string, any>;
}

export function defineConfig<const T extends Config>(config: T) {
  return config;
}
