'use strict'

const Hapi       = require('hapi')
// const Boom    = require('boom')
// const Promise = require('bluebird')
const Path       = require('path')
const auth       = require('./server/config/auth')
const Pack       = require('./package')
const Knex       = require('knex')
const Model      = require('objection').Model
const knex       = Knex(auth.development)
Model.knex(knex)
require('./server/config/user-db').db // without this the db is never connected (can be called from any module)
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

const options = {
  ops: {
    interval: 1000
  },
  reporters: {
    myConsoleReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ log: '*', response: '*' }]
    }, {
      module: 'good-console'
    }, 'stdout'],
    myFileReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ ops: '*' }]
    }, {
      module: 'good-squeeze',
      name: 'SafeJson'
    }, {
      module: 'good-file',
      args: ['./test/fixtures/awesome_log']
    }],
    myHTTPReporter: [{
      module: 'good-squeeze',
      name: 'Squeeze',
      args: [{ error: '*' }]
    }
    // , {
    //     module: 'good-http',
    //     args: ['http://prod.logs:3000', {
    //         wreck: {
    //             headers: { 'x-api-key': 12345 }
    //         }
    //     }]
    // }
    ]
  }
}
const swagger_options = {
  basePath: '/',
  // pathPrefixSize: 2,
  // swaggerUI : false,
  // documentationPage : false,
  // swaggerUIPath: '/ui/',
  info: {
    title: 'Test API Documentation',
    version: Pack.version,
    description: 'This web API was built to demonstrate some of the hapi features and functionality.',
    termsOfService: 'https://github.com/glennjones/hapi-swagger/',
    contact: {
      name: 'test name',
      url: 'https://raw.githubusercontent.com/glennjones/hapi-swagger/master/license.txt',
      email: 'glennjonesnet@gmail.com'
    },
    license: {
      name: 'MIT',
      url: 'https://raw.githubusercontent.com/glennjones/hapi-swagger/master/license.txt'
    }
  },
  tags: [
    {
      name: 'api',
      description: 'API calls'
    }, {
      name: 'users',
      description: 'Users account management'
    }, {
      name: 'store',
      description: 'Storing a sum',
      externalDocs: {
        description: 'Find out more about storage',
        url: 'http://example.org'
      }
    }, {
      name: 'sum',
      description: 'API of sums',
      externalDocs: {
        description: 'Find out more about sums',
        url: 'http://example.org'
      }
    }
  ],
  // jsonEditor: true,
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  security: [{ 'jwt': [] }],
  // auth: 'jwt' // must register the auth strategy before using it in swagger
}

server.register(
  [
    require('hapi-auth-jwt2'),
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
    { register: require('good'), options},
    { register: require('hapi-swagger'), options: swagger_options },
    { register: require('blipp'), options: { showAuth: true } },
    { register: require('hapijs-status-monitor')}
  ],
  function (err) {
    if (err) {
      throw err // handle plugin startup error
    }
  }
)

// Setup the session strategy
server.auth.strategy.apply(null, auth.session)  // coockies session
server.auth.strategy.apply(null, auth.twitter)  // twitter
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

server.ext('onPreResponse', (request, reply) => {
  if (request.response.isBoom) {
    if (request.headers.accept) {
      if (request.headers.accept.indexOf('application/json') === -1) {
        const err = request.response
        const errName = err.output.payload.error
        const statusCode = err.output.payload.statusCode
        if (statusCode === 401) {
          // TODO: redirect to login
          return reply.redirect('/t')
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

/**
  * jwt was hard and confusing, using:
  * https://github.com/auth0-blog/hapi-jwt-authentication
  * https://github.com/Cron-J/JWT-Hapi-Mongoose-Mongodb-with-email-verification-and-forgot-password
  * alas, I finaly combined them, and everything seems working fine
*/
// DONE: check return reply(boom) vs throw boom vs reply boom on server/routes/users
// DONE: Encrypt JWT payload
// DONE: check mongo objectid vs secuential id 
// DONE: fix the error handler onPreResponse has some issues with sending errors on api
// DONE: use swaggered for pretty api https://www.npmjs.com/package/hapi-swaggered or LOUT https://github.com/hapijs/lout
// DONE: fix api route reply boom to throw boom and catch to if.... reply, /persons/id/pet has an example
// DONE: add example, dafault and label to all schemas
// DONE: documented all users routes for swagger
// DONE: documented all api routes for swagger
// DONE: Separated Users into smaller, more manegable files
// DONE: created erros schemas for users
// TODO: create more validation schemas
// TODO: can the jwt as a whole can be encrypted too?
// TODO: separate normal server and api server, with this is easy to separate error representation (no longer necessary but may aswell help organize the server)
// NOTE: JWT can be issued for 30 days to access the api, that means payment authentication method solved
// TODO: add JWT token to user document in mongodb for revocation pruposes
// NOTE: https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage
// TODO: make login with linkedin, fb, twitter, etc.
// TODO: add tests, AVA looks good
// TODO: add comments, lots of comments
// TODO: add cache with redis catbox https://github.com/hapijs/catbox
