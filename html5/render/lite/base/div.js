'use strict'

const proto = {
  create () {
    return document.createElement('div')
  }
}

function init (Weex) {
  const Component = Weex.Component
  const extend = Weex.utils.extend

  function Div (data, nodeType) {
    Component.call(this, data, nodeType)
    this.node.classList.add('weex-container')
  }
  Div.prototype = Object.create(Component.prototype)
  extend(Div.prototype, proto)

  Weex.registerComponent(['div', 'container'].map(name => {
    return {
      name,
      constructor: Div
    }
  }))
}

export default { init }
