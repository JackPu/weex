import { rollup } from 'rollup'
import postcss from 'rollup-plugin-postcss'
import json from 'rollup-plugin-json'
import eslint from 'rollup-plugin-eslint'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'

const pkg = require('../package.json')
const version = pkg.subversion.lite
const date = new Date().toISOString().split('T')[0].replace(/\-/g, '')
const banner = `\
console.log('START WEEX RENDER LITE: ${version} Build ${date}');
`

export default {
  entry: './html5/render/lite/index.js',
  dest: './dist/lite.common.js',
  banner,
  format: 'cjs',
  plugins: [
    postcss(),
    json(),
    eslint({
      exclude: ['./package.json', '**/*.css']
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs(),
    buble()
  ]
}
