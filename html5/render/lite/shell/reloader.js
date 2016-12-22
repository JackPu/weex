'use strict'

/* global WebSocket */

// for weex-toolkit.
export function startRefreshController () {
  if (location.protocol.match(/file/)) {
    return
  }
  if (location.search.indexOf('hot-reload_controller') === -1) {
    return
  }
  if (typeof WebSocket === 'undefined') {
    console.info('auto refresh need WebSocket support')
    return
  }
  const host = location.hostname
  const port = 8082
  const client = new WebSocket('ws://' + host + ':' + port + '/',
    'echo-protocol'
  )
  client.onerror = function () {
    console.log('refresh controller websocket connection error')
  }
  client.onmessage = function (e) {
    console.log('Received: \'' + e.data + '\'')
    if (e.data === 'refresh') {
      location.reload()
    }
  }
}
