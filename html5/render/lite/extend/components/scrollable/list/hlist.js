'use strict'

import listModule from './list'

function init (Weex) {
  const List = listModule.init(Weex)

  function Hlist (data, nodeType) {
    data.attr.direction = 'h'
    List.call(this, data, nodeType)
  }

  Hlist.prototype = Object.create(List.prototype)

  Weex.registerComponent({
    name: 'hlist',
    constructor: Hlist
  })
}

export default { init }
