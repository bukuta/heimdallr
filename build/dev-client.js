/* eslint-disable */
require('eventsource-polyfill')
// much more config please refer https://github.com/glenjamin/webpack-hot-middleware#client
var hotClient = require('webpack-hot-middleware/client?noInfo=true&quiet=true&reload=true')

hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
