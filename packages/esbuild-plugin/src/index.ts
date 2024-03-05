import type { Plugin } from "esbuild";

import fs from "node:fs/promises";

import {
  anyOf,
  char,
  createRegExp,
  exactly,
  global,
  maybe,
  multiline,
  oneOrMore,
  whitespace,
  wordChar,
} from "magic-regexp";

const REGEX = createRegExp(
  maybe(oneOrMore(whitespace)).groupedAs("indentation"),
  maybe(
    anyOf("const", "let", "var"),
    oneOrMore(whitespace),
    oneOrMore(wordChar).or("{", oneOrMore(char), "}"),
    oneOrMore(whitespace),
    "=",
    oneOrMore(whitespace)
  ).groupedAs("variableDeclaration"),
  "await",
  oneOrMore(whitespace),
  "import(",
  maybe(oneOrMore(whitespace)),
  exactly("'", oneOrMore(char), "'")
    .or('"', oneOrMore(char), '"')
    .groupedAs("modulePath"),
  maybe(oneOrMore(whitespace)),
  ")",
  maybe(";").groupedAs("terminator"),
  [global, multiline]
);
const TEMPLATE = `
try {
  var dynamicallyImportedModule = await import(
    /* webpackIgnore: true */
    $<modulePath>
  )$<terminator>
} catch (moduleImportError) {
  throw moduleImportError$<terminator>
}
$<variableDeclaration> dynamicallyImportedModule$<terminator>
`;

export const optionalPeerDependencies: Plugin = {
  name: "esbuild-plugin-optional-peer-dependencies",
  setup(build) {
    build.onLoad({ filter: /\.ts$/ }, async (args) => ({
      contents: (await fs.readFile(args.path, "utf-8")).replace(
        REGEX,
        TEMPLATE
      ),
      loader: "ts",
    }));
  },
};
