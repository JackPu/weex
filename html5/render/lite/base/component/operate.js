'use strict'

import { extend } from '../../utils'
import { getFilters } from './valueFilter'

export function create (nodeType) {
  return document.createElement(nodeType || 'div')
}

// export function createChildren () {
//   const children = this.data.children
//   const parentRef = this.data.ref
//   if (children && children.length) {
//     const fragment = document.createDocumentFragment()
//     let isFlex = false
//     for (let i = 0; i < children.length; i++) {
//       children[i].instanceId = this.data.instanceId
//       children[i].scale = this.data.scale
//       const child = this._doc.createElement(children[i])
//       fragment.appendChild(child.node)
//       child.parentRef = parentRef
//       if (!isFlex
//         && child.data.style
//         && child.data.style.hasOwnProperty('flex')
//       ) {
//         isFlex = true
//       }
//     }
//     this.node.appendChild(fragment)
//   }
// }

// export function appendChild (data) {
//   const children = this.data.children
//   // const child = this._doc.createElement(data)
//   this.node.appendChild(child.node)
//   // update this.data.children
//   if (!children || !children.length) {
//     this.data.children = [data]
//   }
//   else {
//     children.push(data)
//   }
//   return child
// }

export function appendChild (child) {
  // const children = this.data.children
  this.node.appendChild(child.node)

  // update this.data.children
  // if (!children || !children.length) {
    // this.data.children = [child.data]
  // }
  // else {
    // children.push(child.data)
  // }
  child.onAppend && child.onAppend()
  return child
}

export function insertBefore (child, before) {
  // const children = this.node.children
  // let i = 0
  // let l
  // let isAppend = false

  // update this.data.children
  // if (!children || !children.length || !before) {
  //   isAppend = true
  // }
  // else {
  //   for (l = children.length; i < l; i++) {
  //     if (children[i].dataset.ref === before.ref) {
  //       break
  //     }
  //   }
  //   if (i === l) {
  //     isAppend = true
  //   }
  // }

  // if (isAppend) {
  //   this.node.appendChild(child.node)
  //   // children.push(child.data)
  // }
  // else {
  if (before.fixedPlaceholder) {
    this.node.insertBefore(child.node, before.fixedPlaceholder)
  }
  else if (before.stickyPlaceholder) {
    this.node.insertBefore(child.node, before.stickyPlaceholder)
  }
  else {
    this.node.insertBefore(child.node, before.node)
  }
  child.onAppend && child.onAppend()
    // children.splice(i, 0, child.data)
  // }
}

export function removeChild (child) {
  // const children = this.data.children
  // remove from this.data.children
  // let i = 0
  // if (children && children.length) {
  //   let l
  //   for (l = children.length; i < l; i++) {
  //     if (children[i].ref === child.data.ref) {
  //       break
  //     }
  //   }
  //   if (i < l) {
  //     children.splice(i, 1)
  //   }
  // }
  // remove from componentMap recursively
  // this._doc.removeComponent(child.data.ref)
  child.unsetPosition()
  child.node.parentNode.removeChild(child.node)
  child.onRemove && child.onRemove()
}

function update (comp, type, k, v, filter) {
  !comp.data[type] && (comp.data[type] = {})
  comp.data[type][k] = v
  const setter = comp[type][k]
  if (typeof setter === 'function') {
    return setter.call(comp, v)
  }
  if (typeof filter === 'function') {
    v = filter(v)
  }
  comp.node[type][k] = v
}

export function updateAttr (attr) {
  // Note：attr must be injected into the dom element because
  // it will be accessed from the outside developer by event.target.attr.
  !this.node.attr && (this.node.attr = {})
  Object.keys(attr).forEach(key => {
    const value = attr[key]
    update(this, 'attr', key, value, (v) => {
      this.node.setAttribute(key, value)
      return v
    })
  })
}

export function setClassStyle (classStyle) {
  this.data.classStyle = classStyle
  Object.keys(classStyle).forEach(key => {
    let value = classStyle[key]
    if (!this.data.style || !this.data.style[key]) {
      const styleSetter = this.style[key]
      if (typeof styleSetter === 'function') {
        return styleSetter.call(this, value)
      }
      const parser = getFilters(key, { scale: this.data.scale })[typeof value]
      if (typeof parser === 'function') {
        value = parser(value)
      }
      this.node.style[key] = value
    }
  })
}

export function updateStyle (style) {
  Object.keys(style).forEach(key => {
    const value = style[key]
    update(this, 'style', key, value,
      getFilters(key, { scale: this.data.scale })[typeof value])
  })
}

// export function setStyle (style) {
//   !this.data.style && (this.data.style = {})
//   Object.keys(style).forEach(key => {
//     let value = style[key]
//     this.data.style[key] = value
//     const styleSetter = this.style[key]
//     if (typeof styleSetter === 'function') {
//       return styleSetter.call(this, value)
//     }
//     const parser = getFilters(key, { scale: this.data.scale })[typeof value]
//     if (typeof parser === 'function') {
//       value = parser(value)
//     }
//     this.node.style[key] = value
//   })
// }

export function addEvent (type, handler) {
  !this.data.events && (this.data.event = {})
  this.data.event[type] = handler
  this.node.addEventListener(type, function (e) {
    const func = this.event && this.event[type] || {}
    e = extend({}, e, func.extra && func.extra.call(this) || {})
    handler(e)
  }.bind(this))
}

// export function bindEvents (evts) {
//   if (!evts || evts.length <= 0) {
//     return
//   }
//   const self = this
//   const weexInstance = this.getWeexInstance()
//   !this.data.event && (this.data.event = [])
//   const len = evts.length
//   for (let i = 0; i < len; i++) {
//     if (this.data.event.indexOf(evts[i]) <= -1) {
//       this.data.event.push(evts[i])
//     }
//   }
//   evts.map(function (evt) {
//     const func = self.event[evt] || {}
//     const setter = func.setter
//     if (setter) {
//       self.node.addEventListener(evt, setter)
//       return
//     }
//     const sender = weexInstance.sender
//     const listener = function (e) {
//       // do stop bubbling.
//       // do not prevent default, otherwise the touchstart
//       // event will no longer trigger a click event
//       if (e._alreadyTriggered) {
//         return
//       }
//       e._alreadyTriggered = true
//       const event = extend({}, e)
//       event.target = self.data
//       sender.fireEvent(self.data.ref, evt, {
//         extra: func.extra && func.extra.bind(self),
//         updator: func.updator && func.updator.bind(self)
//       }, event)
//     }
//     self.node.addEventListener(evt, listener, false, false)
//     let listeners = self._listeners
//     if (!listeners) {
//       listeners = self._listeners = {}
//       self.node._listeners = {}
//     }
//     listeners[evt] = listener
//     self.node._listeners[evt] = listener
//   })
// }

export function unbindEvents (evts) {
  const self = this
  evts.map(function (evt) {
    const listener = this._listeners
    if (listener) {
      self.node.removeEventListener(evt, listener)
      self._listeners[evt] = null
      self.node._listeners[evt] = null
    }
  })
}
