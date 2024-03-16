import {expectTypeOf} from 'expect-type';
import type {IfDefined, ModuleNotFound} from 'optional-peer-dependencies';

// @ts-expect-error
import type {Type} from 'external-module';

export async function testCases() {
  try {
    // @ts-expect-error
    await import('external-module');
  } catch (error) {}

  try {
    // @ts-expect-error
    const module = await import('external-module');
  } catch (error) {}
  try {
    // @ts-expect-error
    let module = await import('external-module');
  } catch (error) {}
  try {
    // @ts-expect-error
    var module = await import('external-module');
  } catch (error) {}

  try {
    // @ts-expect-error
    const {key} = await import('external-module');
  } catch (error) {}
  try {
    // @ts-expect-error
    const {key, anotherKey} = await import('external-module');
  } catch (error) {}
  try {
    // @ts-expect-error
    const {key: renamedKey, anotherKey} = await import('external-module');
  } catch (error) {}

  expectTypeOf<IfDefined<string>>().toBeString();
  expectTypeOf<IfDefined<Type>>().toBeNever();
  expectTypeOf<IfDefined<string, 'external-module'>>().toBeString();
  expectTypeOf<IfDefined<Type, 'external-module'>>().toEqualTypeOf<
    ModuleNotFound<"Cannot find module 'external-module'">
  >();
}
