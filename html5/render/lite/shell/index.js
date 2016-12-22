'use strict'

/* global lib */

import './gesture'
import 'envd'
import { init as initBase, Component, Atomic } from '../base'
import config from '../config'
import * as methods from '../api/methods'
import extensions from '../extend'

import {
  extend,
  appendStyle,
  camelToKebab,
  kebabToCamel,
  isPlainObject,
  getType,
  getRandom,
  getRgb,
  loopArray,
  detectWebp
} from '../utils'

import { parseUrlArgs } from './urlargs'
import { startRefreshController } from './reloader'
import { load, registerLoader } from './loader'

import {
  registerVmMethods,
  registerModule,
  registerComponent
} from '../static/register'

global.WXEnvironment = {
  weexVersion: config.weexVersion,
  appName: lib.env.aliapp ? lib.env.aliapp.appname : null,
  appVersion: lib.env.aliapp ? lib.env.aliapp.version.val : null,
  platform: 'Web',
  osName: lib.env.browser ? lib.env.browser.name : null,
  osVersion: lib.env.browser ? lib.env.browser.version.val : null,
  deviceWidth: window.innerWidth,
  deviceHeight: window.innerHeight
}

// parse url parameters and set configs.
parseUrlArgs()

// for weex-toolkit
startRefreshController()

// register special methods for Weex framework
registerVmMethods(methods)

export { load }

export function init (Weex) {
  extend(Weex, {
    Component,
    Atomic,
    registerComponent,
    registerModule,
    registerLoader,
    utils: {
      extend,
      appendStyle,
      camelToKebab,
      kebabToCamel,
      isPlainObject,
      getType,
      getRandom,
      getRgb,
      loopArray,
      detectWebp
    },
    config
  })

  // install base components: div, root, droot.
  initBase(Weex)

  // install the extended apis and components.
  Weex.install(extensions)
}
