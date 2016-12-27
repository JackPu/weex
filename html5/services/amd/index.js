/**
 * @fileOverview
 * A simple implementation of AMD for weex.
 */

/**
 * amd modules (<id, module> pair)
 *  - id : instance id.
 *  - module: {
 *        name: module name
 *        , factory: module's factory function
 *        , cached: cached module,
 *        , deps: module's dependencies, always be [] under most circumstances.
 *      }
 */
const modules = {}

const amdService = {

  // create a amd service.
  create: (id, env, config) => {
    const mod = {}
    modules[id] = mod
    const amdObject = {

      /**
       * define a module.
       * @param  {String} name: module name.
       * @param  {Array} deps: dependencies. Always be empty array.
       * @param  {function} factory: factory function.
       */
      define (name, deps, factory) {
        if (mod[name]) {
          console.warn(`already defined module: '${name}'`)
        }
        if (typeof deps === 'function') {
          factory = deps
          deps = []
        }
        mod[name] = { name, factory, cached: false, deps }
      },

      /**
       * require a module.
       * @param  {string} name - module name.
       */
      require (name) {
        const servMod = mod[name]
        if (!servMod) {
          return new Error(`module '${name}' is not defined.`)
        }
        if (servMod.cached) {
          return servMod.cached
        }
        const exports = {}
        const module = { exports }
        const ret = servMod.factory(require, exports, module)
        servMod.cached = ret || module.exports
        return servMod.cached
      }
    }
    return amdObject
  },

  destroy: (id, env) => {
    delete modules[id]
  }
}

export default amdService
