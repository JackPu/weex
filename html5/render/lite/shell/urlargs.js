'use strict'

/* global lib */

import 'httpurl'
import config from '../config'

function noop () {}

export function parseUrlArgs () {
  // in casperjs the protocol is file.
  if (location.protocol.match(/file/)) {
    return
  }

  const params = lib.httpurl(location.href).params

  // set global 'debug' config to true if there's a debug flag in current url.
  const debug = params['debug']
  config.debug = debug === true || debug === 'true'

  !config.debug && (console.debug = noop)

  // config for the 'downgrade'.
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const match = key.match(/^downgrade_(\w+)$/)
      if (!match || !match[1]) {
        continue
      }
      const dk = match[1]
      // downgrade in the config file has the highest priority.
      if (typeof config.downgrade[dk] === 'boolean') {
        continue
      }
      const dr = params[`downgrade_${dk}`]
      config.downgrade[dk] = dr === true || dr === 'true'
    }
  }
}
