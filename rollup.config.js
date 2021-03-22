import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
  //input: [pkg.source, "src/ui/media/Media.js"],

  input: {
    index: "src/index.js",
    media: "src/packages/Media.js",
    contentblocks: "src/packages/ContentBlocks.js"
  },
  output: [
    {
      dir: "dist",
      format: "cjs",
      chunkFileNames: "_chunks/[name]-[hash].js"
    },
    {
      dir: "dist/es",
      format: "es",
      chunkFileNames: "_chunks/[name]-[hash].js"
    }
  ],
  plugins: [
    external(),
    babel({
      exclude: 'node_modules/**'
    }),
    json()
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
