export async function testCases() {
  try {
    // @ts-expect-error
    const module = await import("external-module");
  } catch (error) {}
  try {
    // @ts-expect-error
    let module = await import("external-module");
  } catch (error) {}
  try {
    // @ts-expect-error
    var module = await import("external-module");
  } catch (error) {}

  try {
    // @ts-expect-error
    const { key } = await import("external-module");
  } catch (error) {}
  try {
    // @ts-expect-error
    const { key, anotherKey } = await import("external-module");
  } catch (error) {}
  try {
    // @ts-expect-error
    const { key: renamedKey, anotherKey } = await import("external-module");
  } catch (error) {}
}
