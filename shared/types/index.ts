export type WithRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type WithParent<T> = T & {
  parent?: WithParent<T>;
  children: WithParent<T>[];
};
