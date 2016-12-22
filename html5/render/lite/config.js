/**
 * @fileOverview global config for weex-html5-lite.
 */

'use strict'

// natvieComponentMap should be registered by native from `registerComponents()`.
export default {
  weexVersion: '0.5.0',
  debug: false,
  validRoots: ['div', 'list', 'vlist', 'scroller'],
  downgrade: {
    // root: true
  },
  nativeComponentMap: {
    text: true,
    image: true,
    container: true,
    slider: {
      type: 'slider',
      append: 'tree'
    },
    cell: {
      type: 'cell',
      append: 'tree'
    }
  }
}
