export type IsAny<T> = 0 extends 1 & T ? true : false;
export type IsNever<T> = [T] extends [never] ? true : false;

declare const error: unique symbol;

export type ModuleNotFound<T extends `Cannot find module '${string}'`> = {
  readonly [error]: T;
};

// prettier-ignore
export type IfDefined<T, Module extends string | never = never> =
  IsAny<T> extends false
    ? T
    : IsNever<Module> extends false
      ? ModuleNotFound<`Cannot find module '${Module}'`>
      : never;
