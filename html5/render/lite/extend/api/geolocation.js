'use strict'

const supportGeolocation = 'geolocation' in navigator
const errorMsg = `[h5-render]: browser doesn't support geolocation.`

const geolocation = {
  // options:
  //   - enableHighAccuracy optional, value is true or false, false by default.
  //   - timeout [none-native] optional, value is a number (milliseconds), default vaule is FINFINITY.
  //   - maximumAge [none-native] optional, value is a number (milliseconds), default value is 0.
  getCurrentPosition (successCb, errorCb, options) {
    if (supportGeolocation) {
      navigator.geolocation.getCurrentPosition(successCb, errorCb, options)
    }
    else {
      console.warn(errorMsg)
      errorCb(new Error(errorMsg))
    }
  },

  // options: the same with `getCurrentPosition`.
  watchPosition (successCb, errorCb, options) {
    if (supportGeolocation) {
      const id = navigator.geolocation.watchPosition(pos => {
        pos.watchId = id
        successCb(pos)
      }, errorCb, options)
    }
    else {
      console.warn(errorMsg)
      errorCb(new Error(errorMsg))
    }
  },

  clearWatch (watchId) {
    if (supportGeolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
    else {
      console.warn(errorMsg)
    }
  }
}

const meta = {
  geolocation: [{
    name: 'getCurrentPosition',
    args: ['function', 'function', 'object']
  }, {
    name: 'watchPosition',
    args: ['function', 'function', 'object']
  }, {
    name: 'clearWatch',
    args: ['string']
  }]
}

export default {
  init (Weex) {
    Weex.registerModule({
      name: 'geolocation',
      module: geolocation,
      meta
    })
  }
}
