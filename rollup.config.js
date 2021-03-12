import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import json from '@rollup/plugin-json';
import pkg from './package.json';

export default {
  /*
  input: {
    index: pkg.source,
    Media: "src/ui/media/Media.js"
  },
  */
  input: pkg.source,
  output: [
    // { dir: "dist", format: "cjs" },
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' }
  ],
  plugins: [
    external(),
    babel({
      exclude: 'node_modules/**'
    }),
    del({ targets: ['dist/*'] }),
    json()
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
