/**
 * @fileOverview
 * Weex App constructor & definition
 */

import Differ from './differ'
import config from '../config'

/**
 * App constructor for Weex framework.
 * @param {string} id
 * @param {object} options
 */
export default function App (id, options) {
  this.id = id
  this.options = options || {}
  this.vm = null
  this.customComponentMap = {}
  this.commonModules = {}
  this.callbacks = {}
  this.doc = new config.Document(id, this.options.bundleUrl)
  this.differ = new Differ(id)
  this.uid = 0
}
