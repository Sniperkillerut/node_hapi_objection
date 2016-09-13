'use strict'

var nes = require('nes/client')
const protocol = window.location.protocol.indexOf('https') === -1 ? 'ws' : 'wss'
const client = new nes.Client(protocol + '://' + window.location.host)
// global.nesClient = client
client.connect((error) => {
  if (error) {
    console.log('WebSocket Error: ' + error)
  }
})

// WS Route invocation with POST
global.wsTest = function wstest (val) {
  let options = {
    path: 'hello',
    method: 'POST',
    payload: {
      value: val
    }
  }
  client.request(options, function (err, payload) {
    alert(payload)
  })
}
// WS Subscriptions
var handler = function (update, flags) {
  alert(JSON.stringify(update, null, 4))
  // alert(JSON.stringify(flags, null, 4)) //flags is empty
}
global.wsSubscribe = function wssubscribe(channel) {
  client.subscribe('/item/' + channel, handler, function (error) { })
}
global.wsUnsubscribe = function wsunsubscribe(channel) {
  client.unsubscribe('/item/' + channel, handler, function (error) { })
}
global.wsSubscriptions = function wssubscriptions() {
  let subs = client.subscriptions()
  alert(subs)
}
global.wsSendtoChannel = function wssendtochannel (channel,message) {
  let options = {
    path: 'subscribe',
    method: 'POST',
    payload: {
      message: message,
      channel: channel
    }
  }
  client.request(options, function (err, payload) {
    alert(payload)
  })
}
// WS Broadcast
client.onUpdate = function (update) {
  alert(update)
}
global.wsBroadcast = function wsbroadcast (val) {
  let options = {
    path: 'broadcast',
    method: 'POST',
    payload: {
      message: val
    }
  }
  client.request(options, function (err, payload) {
    alert(payload)
  })
}