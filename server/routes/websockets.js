
module.exports = [
  {
    method: 'GET',
    path: '/chat',
    config: {
    },
    handler: (request, reply) => {
      reply.view('chat.html')
    }
  },
  {
    // WS Route invocation with POST
    method: 'POST',
    path: '/h',
    config: {
      id: 'hello'
    },
    handler: (request, reply) => {
      if (request.payload) {
        reply('your message: ' + request.payload.value)
      } else {
        reply('Hello world!')
      }
    }
  },
  {
    // WS Subscriptions
    method: 'POST',
    path: '/subs',
    config: {
      id: 'subscribe'
    },
    handler: (request, reply) => {
      if (request.payload) {
        const server = require('../../server.js').server
        server.publish('/item/' + request.payload.channel, { channel: request.payload.channel,  message: request.payload.message })
      }
    }
  },
  {
    // WS Broadcast
    method: 'POST',
    path: '/broad',
    config: {
      id: 'broadcast'
    },
    handler: (request, reply) => {
      const server = require('../../server.js').server
      if (request.payload) {
        server.broadcast(request.payload.message)
      }
    }
  }]
