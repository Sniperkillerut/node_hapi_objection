'use strict'

const Hapi       = require('hapi')
// const Boom    = require('boom')
// const Promise = require('bluebird')
const Path       = require('path')
const auth       = require('./server/config/auth')
const Knex       = require('knex')
const Model      = require('objection').Model
const knex       = Knex(auth.development)
Model.knex(knex)
require('./server/users/user-db').db // without this the db is never connected (can be called from any module)
const goodOptions = require('./server/config/goodOptions')
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
    { register: require('good'), goodOptions},
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
// DONE: separated api routes into config and handlers
// DONE: create more validation schemas
// Discarded: separate normal server and api server, with this is easy to separate error representation (no longer necessary but may aswell help organize the server)
// NOTE: In order to separate the server it will be necessary to activate CORS and somewhere I read thet it is insecure and not recommended for production, it will also incresease the server complexity with no real benefits
//  Front, users and api was the idea, but in order to login from the front, it would be necessary to create a CORS to eighter login fron the frontend or to redirect to a login page on the users server since you can not link directly to other server routes
// NOTE: JWT can be issued for 30 days to access the api, that means payment authentication method solved
// TODO: can the jwt as a whole can be encrypted too?
// TODO: add JWT token to user document in mongodb for revocation pruposes
// NOTE: https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage
// TODO: make login with linkedin, fb, twitter, etc.
// TODO: add tests, AVA looks good
// TODO: add comments, lots of comments
// TODO: add cache with redis catbox https://github.com/hapijs/catbox




/**
 python is pretty
 people love perl for its simplicity, but python wins here, many has jumped from perl to python
 cython is for calling C libraries from python (and programming them)
 pypy is an interpreter for python, run faster than normal python, even comparable with cython and some times eve faster
 for backend node and go are faster than python
 for front en javascript is mandatory
 for web games javascript or flash is mandatory
 for games c / c++ / java / c# are mandatory
 for drivers C / c++ / fortran is mandatory
 for multi thread and telecom (chat) enrlang is the best (whatsapp is using it among others)
 rust aims to be the reemplacement of c++, but seems rather slow for that
 ocalm seems to be something between python and haskell, an hybrid you will, people praise it too, but often all who learns ocaml jumps to haskell
 for function haskell is widely used also everyone praises it after learning it, like a new mindset or something, people enjoy it
 speed c>c++>ocaml>c#>go>java>rust>haskell>>node>>>>python
 http://benchmarksgame.alioth.debian.org/u64q/performance.php?test=nbody
 This thread convinced me of not using haskell, instead use python itertools
 https://www.quora.com/Why-dont-more-programmers-use-Haskell
 specially this comment
 https://www.quora.com/Why-dont-more-programmers-use-Haskell/answer/Garry-Taylor-5
 and this is a good one tooh
 ttps://www.quora.com/Why-dont-more-programmers-use-Haskell/answer/Cooper-Nelson-1
 but you must learn functional programming and haskell is a good option for this
  it is really a good thing, just apply what you learn in other languages, you can use functional programming in almost any language
 
 so aparently python is only pretty and fast to prototype, probably the fastest and most developer friendly
  but aparently does not exels at anything else, so you would be better of learning other languages
    unless you want to develop programs fast and dont care about optimizations
 some people seems to hate c++ (that is why rust and go were born)
  but aparently the hate is because there are somethings that are easier to do on any other language
    and yes python is easy and pretty but when you want or need a fast program, there is really not much better than c++ / c thats why games are made in those languages

  my decision: using python only for inhouse proyects, something easy, something fast,
   something not for the real world but rather for my own use pheraps there will come a day when pypy is comparable to c++ applications? even games?
  
 espectacular este comment sobre que lenguaje aprender:
 https://www.quora.com/What-are-the-best-programming-languages-to-learn-today/answers/5866052
 segun ese articulo lo mejor es irse a codigo nativo, todo esta avanzando en la direccion de usar menos el browser y usar mas las apps en celulares, tablets, etc.
  hasta windows 10 ya viene con apps para escritorio, las cuales permiten mas comodidad tanto para el usuario como para el developer debido a que lo nativo es mas flexible que los frontend javascript, mas rapido y mas facil de usar y hacer
  Esto tambien permite trabajar con codigo de alto desempeño (es nativo) y usar las tecnologias web solo para api e intercomunicacion, es el internet de las cosas al fin y al cabo
  con java, c# c++, swift, puedes hacer apps para celular y para escritorio, puedes hacer backend, puedes hacer juegos, te da mas libertad que usar "el mejor" en cada caso (js front, algo back, algo nativo, algo cross, etc.)
  de entre estos, por mucho que deteste a java, ese es el cross platform, con desempeño parecido a c++ despues de optimizar, sirve para android y para todo menos ios
  linkedin y facebook abandonaron sus apps en html5 y se pasaron a nativo en ios y android, da mas desempeño, simplemente no se puede comprar la diferencia
  ejemplo, si haces un youtube, debes hacer nativas las aps por desempeño, velocidad de respuesta, customizacion, etc. no dejar abandonado la pagina con js pero 80% del trafico vendra de movil, hay que hacer que el movil funcione bien 
  este tambien es bueno:
  https://www.quora.com/What-are-the-best-programming-languages-to-learn-today/answer/Jonathan-Tsai
  todos se inclinan por java, que desgracia... xD
  un detractor de java, me convencio de no usarlo =P
  http://disq.us/p/190fu9o
  si java se va, queda c++, la pesadilla con quien nadie quiere tratar.... GO o Rust podran reemplazarlo para cosas generales?
  aparentemente go esta intentando entrar a android para reemplazar a java, pero le faltan algunos cuantos años, nos quedamos con java de momento para android
  c/c++ juegos, java android, python scripts rapidos y experimentos, js web, c# windows, go web? 
  ok, go no sirve xD: (es rapido y todo, pero terminare en haskell para web? o en js, no esta tan mal como lo pintan, hapi ayuda a enmascarar y evitar cosas)
  http://yager.io/programming/go.html
  como en todo, recomiendan bastante python para web tambien, a pesar de ser mas lento que js y no tener mucho soporte para multihilos ni para websockets (usados en realtime web, juegos, chats, etc.),
    pero eso de poder hacer una pagina en un par de horas es lo que lo vende, me llama la atencion, pero a la vez ya tengo mi "boilerplate" de js, ya con copy paste no me hace falta empesar de 0 cada vez
  es sorprendente como recomiendan usar python para todo, para scipts, web, programas propios, creo que dropbox esta hecho en python me parecio leer, a pesar de no tener muy buen desempeño en benchmarks, como que eso de un lenguaje que es rapido de escribir es muy muy apreciado 
  importante ver esto:
  http://www.tiobe.com/tiobe-index//
*/
