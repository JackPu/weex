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
(this.nativeLog || function(s) {console.log(s)})('START WEEX RENDER LITE: ${version} Build ${date}');
var global = this, process = { env: {}};
!window._weex_performance && (window._weex_performance = {});
window._weex_performance.START_INIT_WEEX = new Date().getTime() - performance.timing.navigationStart;
`

export default {
  entry: './html5/render/lite/index.js',
  dest: './dist/lite.js',
  banner,
  format: 'umd',
  moduleName: 'weex',
  sourceMap: 'inline',
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
