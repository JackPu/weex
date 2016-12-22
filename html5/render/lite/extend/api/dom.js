'use strict'

import scroll from 'scroll-to'

let camelToKebab, appendStyle

const dom = {
  /**
   * scrollToElement
   * @param  {string} ref
   * @param  {obj} options {offset:Number}
   *   ps: scroll-to has 'ease' and 'duration'(ms) as options.
   */
  scrollToElement: function (element, options) {
    !options && (options = {})
    const offset = (Number(options.offset) || 0) * this.scale
    if (!element) {
      return console.error(`[h5-render] element doesn't exist.`)
    }
    const parentScroller = element.getParentScroller()
    if (parentScroller) {
      parentScroller.scroller.scrollToElement(element.node, true, offset)
    }
    else {
      const offsetTop = element.node.getBoundingClientRect().top
          + document.body.scrollTop
      const tween = scroll(0, offsetTop + offset, options)
      tween.on('end', function () {
        console.log('scroll end.')
      })
    }
  },

  /**
   * getComponentRect
   * @param {string} ref
   * @param {function} callbackId
   */
  getComponentRect: function (element, cb) {
    const info = { result: false }

    if (element && element === 'viewport') {
      info.result = true
      info.size = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        top: 0,
        left: 0,
        right: document.documentElement.clientWidth,
        bottom: document.documentElement.clientHeight
      }
    }
    else if (element.node) {
      info.result = true
      info.size = element.node.getBoundingClientRect()
    }

    const message = info.result ? info : {
      result: false,
      errMsg: 'Illegal parameter'
    }
    cb()
    return message
  },

  /**
   * for adding fontFace
   * @param {string} key fontFace
   * @param {object} styles rules
   */
  addRule: function (key, styles) {
    key = camelToKebab(key)
    let stylesText = ''
    for (const k in styles) {
      if (styles.hasOwnProperty(k)) {
        stylesText += camelToKebab(k) + ':' + styles[k] + ';'
      }
    }
    const styleText = `@${key}{${stylesText}}`
    appendStyle(styleText, 'dom-added-rules')
  }
}

const meta = {
  dom: [{
    name: 'scrollToElement',
    args: ['string', 'object']
  }, {
    name: 'getComponentRect',
    args: ['string', 'function']
  }, {
    name: 'addRule',
    args: ['string', 'object']
  }]
}

export default {
  init: function (Weex) {
    camelToKebab = Weex.utils.camelToKebab
    appendStyle = Weex.utils.appendStyle

    Weex.registerModule({
      name: 'dom',
      module: dom,
      meta
    })
  }
}
