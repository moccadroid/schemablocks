import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
  input: {
    index: "src/index.js",
    Media: "src/packages/Media.js",
    ContentBlocks: "src/packages/ContentBlocks.js",
    Functions: "src/packages/Functions"
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
      exclude: 'node_modules/**',
      babelHelpers: "runtime",
      plugins: [
        ["@babel/plugin-transform-runtime", {
          "regenerator": true
        }]
      ]
    }),
    json()
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
