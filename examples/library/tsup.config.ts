import { defineConfig } from "tsup";
import { optionalPeerDependencies } from "esbuild-plugin-optional-peer-dependencies";

import baseConfig from "../../tsup.config";

export default defineConfig({
  ...baseConfig,
  esbuildPlugins: [optionalPeerDependencies],
});
