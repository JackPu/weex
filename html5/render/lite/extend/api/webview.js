'use strict'

const webview = {

  goBack: function (element) {
    const webComp = element
    if (!webComp.goBack) {
      console.error('error: the specified component has no method of'
          + ' goBack. Please make sure it is a webview component.')
      return
    }
    webComp.goBack()
  },

  goForward: function (element) {
    const webComp = element
    if (!webComp.goForward) {
      console.error('error: the specified component has no method of'
          + ' goForward. Please make sure it is a webview component.')
      return
    }
    webComp.goForward()
  },

  reload: function (element) {
    const webComp = element
    if (!webComp.reload) {
      console.error('error: the specified component has no method of'
          + ' reload. Please make sure it is a webview component.')
      return
    }
    webComp.reload()
  }

}

const meta = {
  webview: [{
    name: 'goBack',
    args: ['string']
  }, {
    name: 'goForward',
    args: ['string']
  }, {
    name: 'reload',
    args: ['string']
  }]
}

export default {
  init: function (Weex) {
    Weex.registerModule({
      name: 'webview',
      module: webview,
      meta
    })
  }
}
