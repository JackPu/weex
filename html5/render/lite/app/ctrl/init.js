/**
 * @fileOverview
 * instance controls from native
 *
 * - init bundle
 *
 * corresponded with the API of instance manager (framework.js)
 */

import Vm from '../../vm'
import { removeWeexPrefix } from '../../utils'
import {
  defineFn,
  bootstrap,
  register
} from '../bundle'
import { updateActions } from './misc'

/**
 * Init an app by run code witgh data
 * @param  {object} app
 * @param  {string} code
 * @param  {object} data
 */
export function init (app, code, data) {
  console.debug('[JS Framework] Intialize an instance with:\n', data)
  let result

  // prepare app env methods
  const bundleDefine = (...args) => defineFn(app, ...args)
  const bundleBootstrap = (name, config, _data) => {
    result = bootstrap(app, name, config, _data || data)
    updateActions(app)
    // app.doc.listener.createFinish()
    app.doc.createFinish()
    console.debug(`[JS Framework] After intialized an instance(${app.id})`)
  }
  const bundleVm = Vm
  /* istanbul ignore next */
  const bundleRegister = (...args) => register(app, ...args)
  /* istanbul ignore next */
  const bundleRender = (name, _data) => {
    result = bootstrap(app, name, {}, _data)
  }
  /* istanbul ignore next */
  const bundleRequire = name => _data => {
    result = bootstrap(app, name, {}, _data)
  }
  const bundleDocument = app.doc
  /* istanbul ignore next */
  const bundleRequireModule = name => app.requireModule(removeWeexPrefix(name))

  // prepare code
  let functionBody
  /* istanbul ignore if */
  if (typeof code === 'function') {
    // `function () {...}` -> `{...}`
    // not very strict
    functionBody = code.toString().substr(12)
  }
  /* istanbul ignore next */
  else if (code) {
    functionBody = code.toString()
  }

  // wrap IFFE and use strict mode
  functionBody = `(function(global){"use strict"; ${functionBody} })(Object.create(this))`

  const fn = new Function(
    'define',
    'require',
    'document',
    'bootstrap',
    'register',
    'render',
    '__weex_define__', // alias for define
    '__weex_bootstrap__', // alias for bootstrap
    '__weex_document__', // alias for bootstrap
    '__weex_require__',
    '__weex_viewmodel__',
    functionBody
  )

  fn(
    bundleDefine,
    bundleRequire,
    bundleDocument,
    bundleBootstrap,
    bundleRegister,
    bundleRender,
    bundleDefine,
    bundleBootstrap,
    bundleDocument,
    bundleRequireModule,
    bundleVm)

  return result
}
