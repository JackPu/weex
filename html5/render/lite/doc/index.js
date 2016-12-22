/**
 * @fileOverview
 * Document, manager of components.
 */

/* global performance */

import { extend } from '../utils'

let nextNodeRef = 1
function uniqueId () {
  return (nextNodeRef++).toString()
}

const perfNameArr = [
  'START_INIT_WEEX',
  'START_LOAD_BUNDLE',
  'START_RENDER',
  'FINISH_RENDER',
  'LOAD_BUNDLE_TIME',
  'COMPILE_TIME',
  'BUILD_TIME'
]

// import '../../shared/objectAssign'
// import Comment from './comment'
// import Element from './element'
// import Listener from '../listener'
// import { createHandler } from '../handler'
// import { addDoc, removeDoc, appendBody, setBody } from './operation'

const docMap = {}
const typeMap = {}

export function Document (id, url) {
  id = id ? id.toString() : ''
  this.id = id
  this.ref = '_documentElement'
  this.URL = url
  this._weexInstance = global.weex.getInstance(id)

  // addDoc(id, this)
  docMap[id] = this
  this.nodeMap = {}
  // const L = Document.Listener || Listener
  // this.listener = new L(id, handler || createHandler(id, Document.handler))
  // this.createDocumentElement()
}

extend(Document, {
  registerComponent (type, definition) {
    typeMap[type] = definition
  }
})

// default task handler
// Document.handler = null

/**
 * Update all changes for an element.
 * @param {object} element
 * @param {object} changes
 */
function updateElement (el, changes) {
  const attrs = changes.attrs || {}
  for (const name in attrs) {
    el.setAttr(name, attrs[name], true)
  }
  const style = changes.style || {}
  for (const name in style) {
    el.setStyle(name, style[name], true)
  }
}

Object.assign(Document.prototype, {

  /**
   * Get the node from nodeMap.
   * @param {string} reference id
   * @return {object} node
   */
  getRef (ref) {
    return this.nodeMap[ref]
  },

  /**
   * Turn on batched updates.
   */
  open () {
    // this.listener.batched = false
  },

  /**
   * Turn off batched updates.
   */
  close () {
    // this.listener.batched = true
  },

  /**
   * Create the document element.
   * @return {object} documentElement
   */
  // createDocumentElement () {
  //   if (!this.documentElement) {
  //     const el = new Element('document')
  //     el.docId = this.id
  //     el.ownerDocument = this
  //     el.role = 'documentElement'
  //     el.depth = 0
  //     el.ref = '_documentElement'
  //     this.nodeMap._documentElement = el
  //     this.documentElement = el

  //     Object.defineProperty(el, 'appendChild', {
  //       configurable: true,
  //       enumerable: true,
  //       writable: true,
  //       value: (node) => {
  //         appendBody(this, node)
  //       }
  //     })

  //     Object.defineProperty(el, 'insertBefore', {
  //       configurable: true,
  //       enumerable: true,
  //       writable: true,
  //       value: (node, before) => {
  //         appendBody(this, node, before)
  //       }
  //     })
  //   }

  //   return this.documentElement
  // },

  /**
   * Create the body element.
   * @param {string} type
   * @param {objct} props
   * @return {object} body element
   */
  // createBody (type, props) {
  //   return createElement()
  //   if (!this.body) {
  //     const el = new Element(type, props)
  //     setBody(this, el)
  //   }

  //   return this.body
  // },

  /**
   * createBody: generate root component
   * @param {string} type
   * @param {object} props
   */
  createBody (props, type) {
    console.log('[h5-render] createBody', props)
    !props && (props = {})

    const perf = window._weex_performance
    if (performance.mark && performance.measure && performance.getEntriesByName) {
      performance.mark('CREATE_BODY')
      performance.measure('COMPILE_TIME', 'START_RENDER', 'CREATE_BODY')
      perf.COMPILE_TIME = performance.getEntriesByName('COMPILE_TIME')[0].duration
    }
    else {
      perf.COMPILE_TIME = new Date().getTime()
        - performance.timing.navigationStart
        - perf.START_RENDER
    }

    if (this.nodeMap['_root']) {
      return
    }
    // element = element.toJSON()

    props.type = 'root'
    props.rootId = this._weexInstance.rootId
    props.ref = '_root'

    const root = this.createElement(props, type)
    const body = document.querySelector('#' + props.rootId)
          || document.body
    body.appendChild(root.node)
    root._appended = true

    // this.handleAppend(root)
    return root
  },

  /**
   * Create an element.
   * @param {string} tagName
   * @param {objct} props
   * @return {object} element
   */
  // createElement (tagName, props) {
  //   return new Element(tagName, props)
  // },
  createElement (props, tagName) {
    !props && (props = {})
    const typeName = props.type || tagName
    let ComponentType = typeMap[typeName]
    if (!ComponentType) {
      ComponentType = typeMap['div']
    }

    props.instanceId = this.id
    props.scale = this._weexInstance.scale
    props._doc = this
    props.ref = props.ref || uniqueId()
    props.type = typeName
    const component = new ComponentType(props, tagName)
    this.nodeMap[props.ref] = component
    component.node.setAttribute('data-ref', props.ref)

    return component
  },

  /**
   * Create an comment.
   * @param {string} text
   * @return {object} comment
   */
  createComment (text) {
    return {
      nodeType: 8,
      node: document.createComment(text),
      ref: uniqueId(),
      data: {}
    }
  },

  /**
   * Fire an event on specified element manually.
   * @param {object} element
   * @param {string} event type
   * @param {object} event object
   * @param {object} dom changes
   * @return {} anything returned by handler function
   */
  fireEvent (el, type, e, domChanges) {
    if (!el) {
      return
    }
    e = e || {}
    e.type = type
    e.target = el
    e.timestamp = Date.now()
    if (domChanges) {
      updateElement(el, domChanges)
    }
    return el.fireEvent(type, e)
  },

  /**
   * Destroy current document, and remove itself form docMap.
   */
  destroy () {
    // delete this.listener
    delete this._weexInstance
    delete this.nodeMap
    delete docMap[this.id]
    // removeDoc(this.id)
  },

  handleAppend (component) {
    component._appended = true
    component.onAppend && component.onAppend()

    // invoke onAppend on children recursively
    const children = component.data.children
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = this.nodeMap[children[i].ref]
        if (child) {
          this.handleAppend(child)
        }
      }
    }

    // // watch appear/disappear of the component if needed
    // watchIfNeeded(component)

    // // do lazyload if needed
    // component.fireLazyload()
    // // lazyload.startIfNeeded(component);
  },

  createFinish (callback) {
    const perf = window._weex_performance
    const now = new Date().getTime()
    if (performance.mark && performance.measure && performance.getEntriesByName) {
      performance.mark('CREATE_FINISH')
      performance.measure('BUILD_TIME', 'START_RENDER', 'CREATE_FINISH')
      perf.BUILD_TIME = performance.getEntriesByName('BUILD_TIME')[0].duration
    }
    else {
      perf.BUILD_TIME = now
        - performance.timing.navigationStart
        - perf.START_RENDER
    }
    perf.FINISH_RENDER = now - performance.timing.navigationStart

    perfNameArr.forEach(function (k) {
      console.log(`${k}: ${perf[k]}`)
    })
  },

  updateFinish (callback) {
    performance.mark('update_finish')
  },

  refreshFinish (callback) {
    performance.mark('refresh_finish')
  }

})
