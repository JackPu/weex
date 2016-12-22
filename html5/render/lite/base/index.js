'use strict'

import './style/base.css'

import Component from './component'
import Atomic from './atomic'
import root from './root'
import div from './div'
import droot from './droot'

export {
  Component,
  Atomic
}

export function init (Weex) {
  Weex.install(root)
  Weex.install(div)
  Weex.install(droot)
}
