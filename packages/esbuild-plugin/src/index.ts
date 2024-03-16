import type {Loader, Plugin} from 'esbuild';

import {readFileSync} from 'node:fs';
import {extname} from 'node:path';

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
} from 'magic-regexp';

const REGEX = createRegExp(
  maybe(oneOrMore(whitespace)).groupedAs('indentation'),
  maybe(
    anyOf('const', 'let', 'var'),
    oneOrMore(whitespace),
    oneOrMore(wordChar).or('{', oneOrMore(char), '}'),
    oneOrMore(whitespace),
    '=',
    oneOrMore(whitespace),
  ).groupedAs('variableDeclaration'),
  'await',
  oneOrMore(whitespace),
  'import(',
  maybe(oneOrMore(whitespace)),
  exactly("'", oneOrMore(char), "'")
    .or('"', oneOrMore(char), '"')
    .groupedAs('modulePath'),
  maybe(oneOrMore(whitespace)),
  ')',
  maybe(';').groupedAs('terminator'),
  [global, multiline],
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

function getLoader(
  path: string,
  override?: {[ext: string]: Loader},
): Loader | undefined {
  const ext = extname(path);
  if (ext.endsWith('js')) return override?.['js'] ?? 'js';
  if (ext.endsWith('jsx')) return override?.['jsx'] ?? 'jsx';
  if (ext.endsWith('ts')) return override?.['ts'] ?? 'ts';
  if (ext.endsWith('tsx')) return override?.['tsx'] ?? 'tsx';
  return undefined;
}

export const optionalPeerDependencies: Plugin = {
  name: 'esbuild-plugin-optional-peer-dependencies',
  setup(build) {
    build.initialOptions.loader;
    build.onLoad({filter: /\.[cm]?[jt]sx?$/}, async args => ({
      contents: readFileSync(args.path, 'utf-8').replace(REGEX, TEMPLATE),
      loader: getLoader(args.path, build.initialOptions.loader),
    }));
  },
};
