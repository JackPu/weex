'use strict'

const navigator = {

  // config
  //  - url: the url to push
  //  - animated: this configuration item is native only
  //  callback is not currently supported
  push: function (config, cb) {
    window.location.href = config.url
    cb()
  },

  // config
  //  - animated: this configuration item is native only
  //  callback is note currently supported
  pop: function (config, cb) {
    window.history.back()
    cb()
  }

}

const meta = {
  navigator: [{
    name: 'push',
    args: ['object', 'function']
  }, {
    name: 'pop',
    args: ['object', 'function']
  }]
}

export default {
  init: function (Weex) {
    Weex.registerModule({
      name: 'navigator',
      module: navigator,
      meta
    })
  }
}
