import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
  //input: [pkg.source, "src/ui/media/Media.js"],

  input: {
    index: "src/index.js",
    Media: "src/ui/media/Media.js"
  },
  // input: pkg.source
  output: [
    //{ dir: "dist" },
    //{ file: pkg.main, format: 'cjs' },
    //{ file: pkg.module, format: 'esm' }
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
    // del({ targets: ['dist/*'] }),
    json()
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
