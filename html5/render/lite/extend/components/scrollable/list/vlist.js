'use strict'

import listModule from './list'

function init (Weex) {
  const List = listModule.init(Weex)

  function Vlist (data, nodeType) {
    data.attr && (data.attr.direction = 'v')
    List.call(this, data, nodeType)
  }
  Vlist.prototype = Object.create(List.prototype)

  Weex.registerComponent(['list', 'vlist'].map(name => {
    return { name, constructor: Vlist }
  }))
}

export default { init }
