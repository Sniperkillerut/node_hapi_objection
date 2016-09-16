'use strict'

const Hapi            = require('hapi')
// const Promise      = require('bluebird')
const Path            = require('path')
const auth            = require('./server/config/auth')
const Knex            = require('knex')
const Model           = require('objection').Model
const knex            = Knex(auth.development)
Model.knex(knex)
require('./server/users/user-db').db // without this the db is never connected (can be called from any module)
const goodOptions     = require('./server/config/goodOptions')
const swagger_options = require('./server/config/swaggerOptions')

const server = new Hapi.Server({
  debug: {
    request: ['error']
  },
  connections: {
    router: {
      isCaseSensitive: true, // deffault
      stripTrailingSlash: true // NOT deffault
    }
  }
})

server.connection({
  port: auth.server.port,
  host: auth.server.host
})

server.register(
  [
    require('hapi-auth-jwt2')
  ],
  function (err) {
    if (err) {
      throw err // handle plugin startup error
    }
  }
)
server.auth.strategy.apply(null, auth.jws) // jws
// must register the auth strategy before using it in swagger
server.register(
  [
    require('hapi-auth-cookie'),
    require('bell'),
    require('hapi-postgres-connection'),
    require('vision'),
    require('inert'),
    require('nes'),
    { register: require('good'), goodOptions},
    { register: require('hapi-swagger'), options: swagger_options },
    { register: require('blipp'), options: { showAuth: true } },
    { register: require('hapijs-status-monitor') },
  ],
  function (err) {
    if (err) {
      throw err // handle plugin startup error
    }
  }
)

// Setup the session strategy
server.auth.strategy.apply(null, auth.session) // coockies session
server.auth.strategy.apply(null, auth.twitter) // twitter
server.auth.strategy.apply(null, auth.linkedin) // linkedin

server.views({
  engines: { html: require('hapi-dust') },
  relativeTo: Path.join(__dirname),
  path: 'client/templates',
  partialsPath: 'client/templates',
// helpersPath: 'client/templates',
})

const routes = require('./server/routes/')
server.route(routes)


// WS Subscriptions
server.subscription('/item/{id}')

server.ext('onPreResponse', (request, reply) => {
  if (request.response.isBoom) {
    if (request.headers.accept) {
      if (request.headers.accept.indexOf('application/json') === -1) {
        const err = request.response
        const errName = err.output.payload.error
        const statusCode = err.output.payload.statusCode
        if (statusCode === 401) {
          return reply.redirect('/login')
        }
        return reply.view('error', {
          statusCode: statusCode,
          errName: errName
        }).code(statusCode)
      }
    }
  }
  reply.continue()
})

// Start the server
server.start((err) => {
  if (err) {
    throw err
  }
  console.log('Server running at:', server.info.uri)
  
})

module.exports = {
  //exports for websockets to work
  server: server
} 