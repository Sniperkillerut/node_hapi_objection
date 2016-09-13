module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.view('index.html')
    }
  },
  {
    method: 'GET',
    path: '/images/{param*}',
    handler: {
      directory: {
        path: 'client/static/image/'
      }
    }
  },
  {
    method: 'GET',
    path: '/css/{param*}',
    handler: {
      directory: {
        path: 'client/static/css/'
      }
    }
  },
  {
    method: 'GET',
    path: '/js/{param*}',
    handler: {
      directory: {
        path: 'client/static/js/'
      }
    }
  },
  {
    method: 'GET',
    path: '/fonts/{param*}',
    handler: {
      directory: {
        path: 'client/static/fonts/'
      }
    }
  },
  {
    method: 'GET',
    path: '/static/bundle.js',
    config: {
      handler: { file: './node_modules/nes/lib/client.js' },
      description: 'Serve the websocket client library'
    }
  }
]
