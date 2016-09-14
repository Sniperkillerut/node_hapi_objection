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

/**
  * 
 python is pretty
 people love perl for its simplicity, but python wins here, many has jumped from perl to python
 cython is for calling C libraries from python (and programming them)
 pypy is an interpreter for python, run faster than normal python, even comparable with cython and some times even faster
 for backend node and go are faster than python
 for front en javascript is mandatory
 for web games javascript or flash is mandatory
 for games c / c++ / java / c# are mandatory
 for drivers C / c++ / fortran is mandatory
 for multi thread and telecom (chat) enrlang is the best (whatsapp is using it among others)
 rust aims to be the reemplacement of c++, but seems rather slow for that
 ocalm seems to be something between python and haskell, an hybrid if you will, people praise it too, but often all who learns ocaml jumps to haskell
 for functional programming haskell is widely used also everyone praises it after learning it, like a new mindset or something, people enjoy it
 for logic programming prolog was the mest now mercury seems to be the best, logic programming is awesome, I like it more than functional, but there are a lot of things that can not be done, logic is more for queries, SQL is a logic language
 speed c>c++>ocaml>c#>go>java>rust>haskell>>node>>>>python
 http://benchmarksgame.alioth.debian.org/u64q/performance.php?test=nbody
 This thread convinced me of not using haskell, instead use python itertools
 https://www.quora.com/Why-dont-more-programmers-use-Haskell
 specially this comment
 https://www.quora.com/Why-dont-more-programmers-use-Haskell/answer/Garry-Taylor-5
 and this is a good one too
 https://www.quora.com/Why-dont-more-programmers-use-Haskell/answer/Cooper-Nelson-1
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
  es sorprendente como recomiendan usar python para todo, para scipts, web, programas propios, dropbox, duolingo, youtube estan hechos en python, a pesar de no tener muy buen desempeño en benchmarks,
   como que eso de un lenguaje que es rapido de escribir es muy muy apreciado, dicen que ayuda a mejorar y cambiar rapido, con lo cual pueden cubrir mas terreno en menos tiempo y pueden competir mejor en el acelerado mundo web
  importante ver esto:
  http://www.tiobe.com/tiobe-index/
  me inclino mucho por aprender python, pero JS esta dominando y aumentando su dominio, back end, front end, robots, hardware, etc.
  python es muy buen lenguaje "de pegamento" osea, usar librerias escritas en C para desempeño y de resto hacerlo en python, con eso se tiene rapido prototipado, experimentacion, prueba y error, y luego las partes criticas pueden ser cambiadas a C puro
   ademas de que es uno los lenguajes con mas librerias en existencia
  la gente se queja mucho de que JS fomenta el desorden, y hace mas dificil trabajar en equipo, mientras que python lo hace mil veces mas facil, pero eso es supfluo dado que promises no es dificil de entender, solo es algo nuevo y extraño,
   lo mismo que monads en haskell, y con esto se evita el callback hell que tanto teme la gente, y como puse mas arriba, hapi ayuda en esto con un poco mas de orden, de paso puedes usar el JS standar format, un plugin y listo, ya todo se entiende y funciona bien incluso en equipos mas grandes
   por tanto en lo unico en que gana python vs JS es que python se puede usar en ".exes", que es por defecto mas rapido de escribir, mas facil de entender que JS y que lleva mas años de uso por lo tanto tiene mas librerias,
   pero JS se lo esta alcansando y se lo va a pasar si ya no lo hizo, JS es mas rapido (se compila a C), y en cuanto a web, es mas multi usos, en cuanto a "exes" si gana python
*/
