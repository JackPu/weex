'use strict'

/**
 * @fileOverview register for app.
 */

/**
 * get a custom component options
 */
export function requireCustomComponent (app, name) {
  const { customComponentMap } = app
  return customComponentMap[name]
}

/**
 * register a custom component options
 */
export function registerCustomComponent (app, name, def) {
  const { customComponentMap } = app

  if (customComponentMap[name]) {
    console.error(`[JS Framework] define a component(${name}) that already exists`)
    return
  }

  customComponentMap[name] = def
}
