import { hyphenate, trimComment, normalizeStyles } from '../utils'
// import { validateStyles } from '../validator'

// let warned = false

function hyphenateExtend (to, from) {
  if (!from) { return }
  for (const k in from) {
    to[hyphenate(k)] = from[k]
  }
}

function getHeadStyleMap () {
  return Array.from(document.styleSheets || [])
    .reduce((pre, styleSheet) => {
      // why not using styleSheet.rules || styleSheet.cssRules to get css rules ?
      // because weex's components defined non-standard style attributes, which is
      // auto ignored when access rule.cssText.
      const strArr = trimComment(styleSheet.ownerNode.textContent.trim()).split(/\.(?!\d+)/)
      const len = strArr.length
      const rules = []
      for (let i = 0; i < len; i++) {
        const str = strArr[i]
        if (!str || str.match(/^\s*$/)) {
          continue
        }
        const match = str.match(/^([^{\s]+)\s*{\s*([^}]+)}\s*$/)
        if (!match) {
          // not the vue static class styles map. so acquire no rules for this styleSheet.
          // just jump through this styleSheet and go to analyzing next.
          return pre
        }
        rules.push({
          selectorText: `.${match[1]}`,
          cssText: match[2].trim()
        })
      }
      Array.from(rules).forEach(rule => {
        const selector = rule.selectorText || ''
        pre[selector] = trimComment(rule.cssText).split(';')
          .reduce((styleObj, statement) => {
            statement = statement.trim()
            if (statement && statement.indexOf('/*') <= -1) {
              const resArr = statement.split(':').map((part) => part.trim())
              styleObj[hyphenate(resArr[0])] = resArr[1]
            }
            return styleObj
          }, {})
      })
      return pre
    }, {})
}

// function getWarnText (prop) {
//   return `[Vue Rneder] "${prop}" is not a standard CSS property,`
//     + 'it may not support very well on weex vue render.'
// }

// function normalize (styles) {
//   const realStyle = {}
//   for (const key in styles) {
//     let value = styles[key]

//     // TODO: add more reliable check
//     if (typeof value === 'number') {
//       value += 'px'
//     }

//     // warn for unsupported properties
//     switch (key) {
//       case 'lines':
//       case 'item-color':
//       case 'itemColor':
//       case 'item-selected-color':
//       case 'itemSelectedColor':
//       case 'item-size':
//       case 'itemSize': console.warn(getWarnText(key)); break
//     }

//     realStyle[key] = value
//   }
//   return realStyle
// }

// function getStyleMap (component) {
//   if (component && component.$vnode && component.$vnode.context) {
//     const $options = component.$vnode.context.$options
//     if ($options && $options.style) {
//       if (!warned) {
//         warned = true
//         console.error('[Invalid Bundle Format] This bundle format is '
//           + 'generated for Android and iOS platform, '
//           + 'please use "vue-loader" to compile the ".vue" file on the web.')
//       }
//       return $options.style
//     }
//   }
// }

// function getStaticClass (component) {
//   if (component && component.$vnode && component.$vnode.data) {
//     const data = component.$vnode.data
//     return [].concat(data.staticClass, data.class)
//   }
// }

// function getComponentStyle (context) {
  // const styleMap = getStyleMap(context)
  // const staticClass = getStaticClass(context)

  // if (styleMap && Array.isArray(staticClass)) {
  //   const styles = staticClass.reduce((res, name) => {
  //     return extend(res, styleMap[name])
  //   }, {})

  //   return normalize(styles)
  // }
// }

// function mergeStyles (context) {
//   const styles = getComponentStyle(context)
//   if (context.$el && styles) {
//     validateStyles(context.$options && context.$options._componentTag, styles)
//     for (const key in styles) {
//       context.$el.style[key] = styles[key]
//     }
//   }
// }

export default {
  beforeCreate () {
    // get static class style map from document's styleSheets.
    if (!weex.styleMap) {
      weex.styleMap = getHeadStyleMap()
      Object.freeze(weex)
    }
  },

  methods: {
    // get style from class, staticClass, style and staticStyle.
    _getComponentStyle (data) {
      const style = {}
      const _scopeId = this._getScopeId && this._getScopeId()
      const staticClassNames = (typeof data.staticClass === 'string') ? [data.staticClass] : (data.staticClass || [])
      const classNames = (typeof data.class === 'string') ? [data.class] : (data.class || [])

      /**
       * merge styles. priority: high -> low
       *  1. data.style (bound style).
       *  2. data.staticStyle (inline styles).
       *  3. data.class style (bound class names).
       *  4. data.staticClass style (scoped styles or static classes).
       */
      staticClassNames.forEach(n => {
        let cls = ''
        if (_scopeId) {
          cls = `.${n}[${_scopeId}]`
        }
        const ruleMap = weex.styleMap[cls] || {}
        hyphenateExtend(style, ruleMap)
      })
      classNames.forEach(n => {
        let cls = ''
        if (_scopeId) {
          cls = `.${n}[${_scopeId}]`
        }
        const ruleMap = weex.styleMap[cls] || {}
        hyphenateExtend(style, ruleMap)
      })
      hyphenateExtend(style, data.staticStyle)
      hyphenateExtend(style, data.style)

      // filter styles.
      return normalizeStyles(style)
    },

    // merge static styles and static class styles into $vnode.data.mergedStyles.
    _mergeStyles () {
      const vnode = this.$options._parentVnode || {}
      const data = vnode.data
      if (!data) { return }
      this.$options._parentVnode.data.staticStyle = this._getComponentStyle(data)
    },

    _getParentRect () {
      const parentElm = this.$options._parentElm
      return parentElm && parentElm.getBoundingClientRect()
    },

    _getParentRectAsync (cb) {
      this.$nextTick(function () {
        return cb && cb.call(this, this.getParentRectSync())
      })
    }
  }
}
