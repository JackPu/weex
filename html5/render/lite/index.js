/* global performance */

/**
 * @fileOverview weex-html5-lite entry.
 */

'use strict'

import { getType, getRandom } from './utils'
import Vm from './vm'
import { Document } from './doc'
// export { createInstance } from './static/create'
import { createInstance } from './static/create'
// export { init, refreshInstance, destroyInstance } from './static/life'
import { init as initConfig, refreshInstance, destroyInstance } from './static/life'
// import runtime from './runtime'
// import frameworks from './frameworks'
// export { receiveTasks } from './static/bridge'
// import { getRoot } from './static/misc'

import { load, init as initShell } from './shell'

import config from './config'

// import { Sender, receiver } from '../bridge'\
const instanceMap = {}
// import ComponentManager from '../dom/componentManager'
// import { bind as bindRegister } from './register'
import { subversion } from '../../../package.json'
const { framework, transformer } = subversion

const DEFAULT_DESIGN_WIDTH = 750
const DEFAULT_ROOT_ID = 'weex'
const DEFAULT_JSONP_CALLBACK_NAME = 'weexJsonpCallback'

// register framework meta info
global.frameworkVersion = framework
global.transformerVersion = transformer

initConfig({ Document })

/**
 * Prevent modification of Vm and Vm.prototype
 */
Object.freeze(Vm)

export default function Weex (options) {
  if (!(this instanceof Weex)) {
    return new Weex(options)
  }

  const id = options.appId
  this.instanceId = id
  if (!this.instanceId) {
    return console.error('[h5-render] appId is needed for Weex.init.')
  }

  const instance = instanceMap[id]
  if (instance) {
    console.error(`invalid instance id "${id}"`)
    return instance
  }

  // Width of the root container. Default is window.innerWidth.
  this.width = options.width || window.innerWidth
  this.bundleUrl = options.bundleUrl || location.href
  this.rootId = options.rootId || (DEFAULT_ROOT_ID + getRandom(10))
  this.designWidth = options.designWidth || DEFAULT_DESIGN_WIDTH
  this.jsonpCallback = options.jsonpCallback || DEFAULT_JSONP_CALLBACK_NAME
  this.source = options.source
  this.loader = options.loader
  this.embed = options.embed

  // downgrade options.
  const dg = options.downgrade || []
  dg.forEach(function (comp) {
    config.downgrade[comp] = true
  })

  instanceMap[this.instanceId] = this

  this.data = options.data
  this.scale = this.width / this.designWidth
  // receiver.init(this)
  // this.sender = new Sender(this)

  // load bundle.
  load({
    jsonpCallback: this.jsonpCallback,
    source: this.source,
    loader: this.loader
  }, function (err, appCode) {
    if (!err) {
      this.createApp(config, appCode)
    }
    else {
      console.error('load bundle err:', err)
    }
  }.bind(this))
}

Weex.init = function (options) {
  if (Array.isArray(options)) {
    options.forEach(function (config) {
      new Weex(config)
    })
  }
  else if (getType(options) === 'object') {
    new Weex(options)
  }
}

Weex.getInstance = function (instanceId) {
  return instanceMap[instanceId]
}

Weex.prototype = {

  createApp: function (config, appCode) {
    // make sure there's a dom container with the specified rootId in
    // the dom tree.
    let root = document.querySelector('#' + this.rootId)
    if (!root) {
      root = document.createElement('div')
      root.id = this.rootId
      document.body.appendChild(root)
    }

    // perf: START_RENDER
    performance.mark && performance.mark('START_RENDER')
    global._weex_performance.START_RENDER = new Date().getTime() - performance.timing.navigationStart

    const versionRegExp = /^\s*\/\/ *(\{[^}]*\}) *\r?\n/

    /**
     * Detect a JS Bundle code and make sure which framework it's based to. Each JS
     * Bundle should make sure that it starts with a line of JSON comment and is
     * more that one line.
     * @param  {string} code
     * @return {object}
     */
    function checkVersion (code) {
      let info
      const result = versionRegExp.exec(code)
      if (result) {
        try {
          info = JSON.parse(result[1])
        }
        catch (e) {}
      }
      return info
    }

    this.bundleInfo = checkVersion(appCode)
    config.bundleVersion = (this.bundleInfo || {}).version
    console.debug(`[JS Framework] create an weex@${config.bundleVersion} instance.`)

    const err = createInstance(this.instanceId, appCode, {
      bundleUrl: this.bundleUrl,
      debug: config.debug,
      env: global.WXEnvironment,
      bundleVersion: config.bundleVersion
    }, this.data)

    if (err instanceof Error) {
      return console.error('[h5-render]', err)
    }

    // Do not destroy instance before unload, because in most browser
    // press back button to back to this page will not refresh
    // the window and the instance will not be recreated then.
    // window.addEventListener('beforeunload', function (e) {
    // })
  },

  // getComponentManager: function () {
  //   if (!this._componentManager) {
  //     this._componentManager = ComponentManager.getInstance(this.instanceId)
  //   }
  //   return this._componentManager
  // },

  getRoot: function () {
    return document.querySelector('#' + this.rootId)
  },

  destroy: function () {
    return destroyInstance(this.instanceId)
  },

  refresh (data) {
    return refreshInstance(this.instanceId, data)
  }
}

// Weex.destroy = function (instanceId) {
//   if (!instanceId) {
//     return Object.keys(instanceMap).map(function (instanceId) {
//       Weex.destroy(instanceId)
//     })
//   }
//   destroyInstance(instanceId)
// }

Weex.install = function (mod) {
  mod.init(Weex)
}

initShell(Weex)

global.weex = Weex
