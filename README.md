# node_hapi_objection
Building a boilerplate with HapiJS, Objection and lots of examples in NodeJS

This is just the project in wich I am learning to use NodeJS with HapiJS reading
a lot of documentation online and other examples even combining them into a more
complete example
for example, I combined these two **JWT** examples:

  * <https://github.com/auth0-blog/hapi-jwt-authentication>
  * <https://github.com/Cron-J/JWT-Hapi-Mongoose-Mongodb-with-email-verification-and-forgot-password>

JWT was hard and confusing but I managed to get it working.

***
## List of example things working:

 * **HapiJS:** With routes, configs, handlers, and everything separated and organized
 * **Mongodb:**  Mongodb Database for Users register and login
 * **Objection:** Objection is a ORM that uses Knex to connect to a Postgresql 
 Database, I am using this to create any other database useful for your webapp,
 right now using Objection examples
 * **API_REST:** A simple REST API working
 * **Validations:** For the API, users register, login, etc. all using [JOI](https://github.com/hapijs/joi)
 * **JWT:**  "Jewah Tokens" like a friend calls them  (actually JSON Web Tokens),
 useful for APIs authentication
   * Also encrypted the JWT payload information
 * **BELL:** For OAuth2 LinkedIn and twitter login
 * **Session:** For a Cookie example in wich the LinkedIn or Twitter information
 is saved
 * **Swagger:**  For pretty API documentation
 * **Web sockets:** Using [NES](https://github.com/hapijs/nes), with Route invocation, subscriptions and broadcast
 working 
 * **Gulp:** For automation of uglify, minify, browserify, babelify, fonts,
 images, linting, etc.
   * Calling Gulp from the cmd will run browsersync and will watch project files
   for changes, so that it is possible to view changes live on every save 
 * **NPM Scripts:** Not sure if this is working, it only works in Linux and right
 now I can't test them
 
***
## TODOs:

 * Integrate the OAuth logins with the Mongodb Database
 * Can the jwt as a whole can be encrypted too?
 * Add JWT token to user document in Mongodb for revocation purposes
 * Add tests, [AVA](https://github.com/avajs/ava) looks good
 * Add comments, lots of comments
 * Add cache with redis [catbox](https://github.com/hapijs/catbox)
 * Create a proper front-end using [VUE](https://vuejs.org/)
 * Get to really use templating engines like [Dustjs](http://www.dustjs.com/)
 * [Where to store JWT](https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage)
 
 
***
### Little Change log:
 
 * Check return reply(boom) vs throw boom vs reply boom on server/routes/users
   * Turns out that **return** is used like a **break**, so **return reply(...)**
   is the same as **reply(...) return** (use return only when necessary)
   * Formated all **return reply(..)** occurrences for easier understanding
 * Encrypt JWT payload 
 * Check Mongo ObjectID vs sequential ID
   * One of the examples that I was following changed default Mongodb ObjectID
    for a sequential ID, turns out that ObjectID is guaranteed to be unique and
    unrepeteable, and it also saves time date of object creation, this allows
    for later on catastrophe recovery and also saves an extra "slot" for time
    date on each document
 * Fix the error handler onPreResponse has some issues with sending errors on api
   * Fixed with some extra IFs
 * Use [swaggered](https://www.npmjs.com/package/hapi-swaggered) for pretty api
   or [OUT](https://github.com/hapijs/lout)
 * Fix API route reply boom to throw boom and catch to if.... reply,
 /persons/id/pet has an example
   * It was using reply to send errors, but it caused a weird double reply, so I
   changed it to throw and catch instead, it is working now
 * Add _example_, _default_ and _label_ to all schemas
 * Documented all users routes for swagger
 * Documented all API routes for swagger
 * Separated Users into smaller, more manageable files
 * Created errors schemas for users
 * Separated API routes into config and handlers
 * Create more validation schemas
 * Make login with LinkedIn, fb, twitter, etc.
 * Add WS (Web socket) with [NES](https://github.com/hapijs/nes)

***
## Notes:
 *  ~~separate normal server and API server, with this is easy to separate
error representation (no longer necessary but may aswell help organize the server)~~
    * In order to separate the server it will be necessary to activate CORS
and somewhere I read that it is insecure and not recommended for production, it
will also increase the server complexity with no real benefits
    * Front, users and API was the idea, but in order to login from the front, it
would be necessary to create a CORS to either login from the frontend or to
redirect to a login page on the users server since you can not link directly to
other server routes
 * JWT can be issued for 30 days to access the API, that means payment
authentication method solved
 * [A really good HapiJS general tutorial](https://futurestud.io/tutorials/hapi-get-your-server-up-and-running)
 * As stated before, I used 2 guides for JWT, around 5 for WS, around 3 for 
 Objection, 3 for Mongo, like 10 for HapiJS, 4 for Swaggered, 2 for Bell, a lot
 for API_REST, a lot for Gulp, around 3 for NPM Scripts, and so on, unfortunately
 I didn't save the links for them if you notice some of your code in here, let
 me know, I will add your links


 ***
 ### NPM Libraries used:

  * [bell](https://github.com/hapijs/bell)
  * [blipp](https://github.com/danielb2/blipp)
  * [bluebird](https://github.com/petkaantonov/bluebird)
  * [boom](https://github.com/hapijs/boom)
  * [dustjs-helpers](https://github.com/linkedin/dustjs-helpers)
  * [dustjs-linkedin](https://github.com/linkedin/dustjs)
  * [good](https://github.com/hapijs/good)
  * [good-console](https://github.com/hapijs/good-console)
  * [good-file](https://github.com/hapijs/good-file)
  * [good-http](https://github.com/hapijs/good-http)
  * [good-squeeze](https://github.com/hapijs/good-squeeze)
  * [hapi](http://hapijs.com/)
  * [hapi-auth-cookie](https://github.com/hapijs/hapi-auth-cookie)
  * [hapi-auth-jwt2](https://github.com/dwyl/hapi-auth-jwt2)
  * [hapi-dust](https://github.com/mikefrey/hapi-dust)
  * [hapi-postgres-connection](https://github.com/jedireza/hapi-node-postgres)
  * [hapi-swagger](https://github.com/glennjones/hapi-swagger)
  * [hapijs-status-monitor](https://github.com/ziyasal/hapijs-status-monitor)
  * [inert](https://github.com/hapijs/inert)
  * [joi](https://github.com/hapijs/joi)
  * [joi-objectid](https://github.com/pebble/joi-objectid)
  * [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
  * [knex](http://knexjs.org/)
  * [moment](http://momentjs.com/)
  * [mongoose](http://mongoosejs.com/)
  * [nes](https://github.com/hapijs/nes)
  * [nodemailer](https://github.com/nodemailer/nodemailer)
  * [nodemailer-mailgun-transport](https://github.com/orliesaurus/nodemailer-mailgun-transport)
  * [nodemailer-smtp-transport](https://github.com/nodemailer/nodemailer-smtp-transport)
  * [objection](https://github.com/Vincit/objection.js/)
  * [pg](https://github.com/brianc/node-postgres)
  * [vision](https://github.com/hapijs/vision)

#### Development Dependencies:

  * [autoprefixer](https://www.npmjs.com/package/autoprefixer)
  * [babel-core](https://www.npmjs.com/package/babel-core)
  * [babel-eslint](https://www.npmjs.com/package/babel-eslint)
  * [babel-preset-es2015](https://www.npmjs.com/package/babel-preset-es2015)
  * [babelify](https://www.npmjs.com/package/babelify)
  * [browser-sync](https://www.browsersync.io/)
  * [browserify](https://www.npmjs.com/package/browserify)
  * [clean-css](https://www.npmjs.com/package/clean-css)
  * [del](https://www.npmjs.com/package/del)
  * [eslint](https://www.npmjs.com/package/eslint)
  * [gulp](https://www.npmjs.com/package/gulp)
  * [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)
  * [gulp-cache](https://www.npmjs.com/package/gulp-cache)
  * [gulp-concat](https://www.npmjs.com/package/gulp-concat)
  * [gulp-cssnano](https://www.npmjs.com/package/gulp-cssnano)
  * [gulp-eslint](https://www.npmjs.com/package/gulp-eslint)
  * [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin)
  * [gulp-notify](https://www.npmjs.com/package/gulp-notify)
  * [gulp-rename](https://www.npmjs.com/package/gulp-rename)
  * [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps)
  * [gulp-uglify](https://www.npmjs.com/package/gulp-uglify)
  * [imagemin-cli](https://www.npmjs.com/package/imagemin-cli)
  * [npm-run-all](https://www.npmjs.com/package/npm-run-all)
  * [onchange](https://www.npmjs.com/package/onchange)
  * [postcss-cli](https://www.npmjs.com/package/postcss-cli)
  * [run-sequence](https://www.npmjs.com/package/run-sequence)
  * [svg-sprite-generator](https://www.npmjs.com/package/svg-sprite-generator)
  * [svgo](https://www.npmjs.com/package/svgo)
  * [uglify-js-harmony](https://www.npmjs.com/package/uglify-js-harmony)
  * [vinyl-buffer](https://www.npmjs.com/package/vinyl-buffer)
  * [vinyl-source-stream](https://www.npmjs.com/package/vinyl-source-stream)