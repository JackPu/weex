'use strict'

import { transitionOnce } from './lib'

const _data = {}

const animation = {

  /**
   * transition
   * @param  {Component} element
   * @param  {obj} config
   * @param  {function} callback
   */
  transition: function (element, config, cb) {
    const ref = element.ref
    let refData = _data[ref]
    const stylesKey = JSON.stringify(config.styles)
    // If the same component perform a animation with exactly the same
    // styles in a sequence with so short interval that the prev animation
    // is still in playing, then the next animation should be ignored.
    if (refData && refData[stylesKey]) {
      return
    }
    if (!refData) {
      refData = _data[ref] = {}
    }
    refData[stylesKey] = true

    return transitionOnce(element, config, function () {
      // Remove the stylesKey in refData so that the same animation
      // can be played again after current animation is already finished.
      delete refData[stylesKey]
      cb()
    })
  }
}

const meta = {
  animation: [{
    name: 'transition',
    args: ['object', 'object', 'function']
  }]
}

export default {
  init: function (Weex) {
    Weex.registerModule({
      name: 'animation',
      module: animation,
      meta
    })
  }
}
