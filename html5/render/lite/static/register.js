/**
 * @fileOverview register for framework.
 * static register methods:
 *  - registerVmMethods (methods)
 *  - registerModule(module)
 *  - requireModule(name)
 *  - *getModule (moduleName)
 *  - *clearModules ()
 *  - registerComponent (component)
 */

'use strict'

import Vm from '../vm'
import config from '../config'
import { Document } from '../doc'

const {
  nativeComponentMap
} = config

let nativeModules = {}

// for vm methods.

/**
 * Register the name and methods of each api to Vm's prototype.
 * @param  {object} apis a object of apis
 */
export function registerVmMethods (methods) {
  /* istanbul ignore else */
  if (typeof methods === 'object') {
    const p = Vm.prototype
    for (const apiName in methods) {
      if (!p.hasOwnProperty(apiName)) {
        p[apiName] = methods[apiName]
      }
    }
  }
}

// for api modules.

/**
 * register a api module.
 * @param  {object} module
 *  - name
 *  - module
 *  - meta
 */
export function registerModule (module) {
  const { name } = module
  nativeModules[name] = module
}

/**
 * get a module of methods.
 *  - module: { name, module, meta }
 */
export function requireModule (name) {
  const mod = nativeModules[name] || {}
  return mod.module
  // const target = {}
  // for (const methodName in methods) {
  //   target[methodName] = (...args) => app.callTasks({
  //     module: name,
  //     method: methodName,
  //     args: args
  //   })
  // }
  // return target
}

/**
 * for testing
 */
export function getModule (moduleName) {
  return nativeModules[moduleName]
}
 /** for testing
 */
export function clearModules () {
  nativeModules = {}
}

/**
 * init modules for an app instance
 * the second param determines whether to replace an existed method
 */
// export function initModules (modules, ifReplace) {
//   // extend(nativeModules, modules)
//   for (const moduleName in modules) {
//     // init `modules[moduleName][]`
//     let methods = nativeModules[moduleName]
//     if (!methods) {
//       methods = {}
//       nativeModules[moduleName] = methods
//     }

//     // push each non-existed new method
//     modules[moduleName].forEach(function (method) {
//       if (typeof method === 'string') {
//         method = {
//           name: method
//         }
//       }

//       if (!methods[method.name] || ifReplace) {
//         methods[method.name] = method
//       }
//     })
//   }
// }

// for components.

/**
 * register a natvie component
 * @param  {object} component:
 *  - name
 *  - component
 *  - meta
 *    - type: name
 */
export function registerComponent (component) {
  if (Array.isArray(component)) {
    return component.forEach(registerComponent)
  }
  const { name, constructor, meta } = component
  if (typeof meta === 'object' && typeof meta.type === 'string') {
    nativeComponentMap[meta.type] = meta
  }
  return Document.registerComponent(name, constructor)
}

/**
 * Register the name of each native component.
 * @param  {array} components array of name
 */
// export function registerComponents (components) {
//   if (Array.isArray(components)) {
//     components.forEach(function register (name) {
//       /* istanbul ignore if */
//       if (!name) {
//         return
//       }
//       if (typeof name === 'string') {
//         nativeComponentMap[name] = true
//       }
//       /* istanbul ignore else */
//       else if (typeof name === 'object' && typeof name.type === 'string') {
//         nativeComponentMap[name.type] = name
//       }
//     })
//   }
// }

/**
 * Register a api module.
 * @param  {object} modules a object of modules
 */
// export function registerModules (name, module) {
  /* istanbul ignore else */
  // if (typeof modules === 'object') {
  //   initModules(modules)
  // }
  // registerModule(name, module)
// }

// @todo: Hack for this framework only. Will be re-designed or removed later.
// global.registerMethods = registerMethods
