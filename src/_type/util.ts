/**
 * Deep Partial
 * @see https://stackoverflow.com/a/49936686/2500707
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>;
};

export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
