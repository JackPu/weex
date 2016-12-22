'use strict'

import modal from 'modals'

const msg = {

  // duration: default is 0.8 seconds.
  toast: function (config) {
    modal.toast(config.message, config.duration)
  },

  // config:
  //  - message: string
  //  - okTitle: title of ok button
  //  - callback
  alert: function (config, callback) {
    config.callback = callback
    modal.alert(config)
  },

  // config:
  //  - message: string
  //  - okTitle: title of ok button
  //  - cancelTitle: title of cancel button
  //  - callback
  confirm: function (config, callback) {
    config.callback = callback
    modal.confirm(config)
  },

  // config:
  //  - message: string
  //  - okTitle: title of ok button
  //  - cancelTitle: title of cancel button
  //  - callback
  prompt: function (config, callback) {
    config.callback = callback
    modal.prompt(config)
  }
}

const meta = {
  modal: [{
    name: 'toast',
    args: ['object']
  }, {
    name: 'alert',
    args: ['object', 'function']
  }, {
    name: 'confirm',
    args: ['object', 'function']
  }, {
    name: 'prompt',
    args: ['object', 'function']
  }]
}

export default {
  init: function (Weex) {
    Weex.registerModule({
      name: 'modal',
      module: msg,
      meta
    })
  }
}
