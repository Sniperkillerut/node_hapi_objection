'use strict';

const Hapi = require('hapi');
//const Boom = require('boom');
const Path = require('path');
//const Good = require('good');
//const Promise = require('bluebird');
const auth = require('./server/config/auth');
const server = new Hapi.Server({ debug: { request: ['error'] } });
const Knex = require('knex');
const Model = require('objection').Model;
const knex = Knex(auth.development);
Model.knex(knex);

server.connection({
    port: auth.server.port,
    host: auth.server.host
});

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
};

server.register(
    [
        require('hapi-auth-cookie'),
        require('hapi-auth-jwt'),
        require('bell'),
        require('hapi-postgres-connection'),
        require('vision'),
        require('inert'),
        {
            register: require('good'),
            options,
        },
    ], function(err) {
    if (err) {
        throw err;// handle plugin startup error
    }  
});


//Setup the session strategy
server.auth.strategy.apply(null, auth.session); //coockies session
server.auth.strategy.apply(null, auth.twitter); //twitter
server.auth.strategy.apply(null, auth.linkedin); //linkedin
server.auth.strategy.apply(null, auth.jws); //jws

server.views({
    engines: { html: require('hapi-dust') },
    relativeTo: Path.join(__dirname),
    path: 'client/templates',
    partialsPath: 'client/templates',
    // helpersPath: 'client/templates',
});

const routes = require('./server/routes/');
server.route(routes);


// server.ext('onPreResponse', (request, reply) => {
//     if (request.response.isBoom) {
//         const err = request.response;
//         const errName = err.output.payload.error;
//         const statusCode = err.output.payload.statusCode;

//         return reply.view('error', {
//             statusCode: statusCode,
//             errName: errName
//         })
//         .code(statusCode);
//     }
//     reply.continue();
// });

 // Start the server
server.start((err) => {
    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});


/**
 * jwt was hard and confusing, using:
 * https://github.com/auth0-blog/hapi-jwt-authentication
 * https://github.com/Cron-J/JWT-Hapi-Mongoose-Mongodb-with-email-verification-and-forgot-password
 * alas, I finaly combined them, and everything seems working fine
 * 
 * TODO: check return reply(boom) vs throw boom vs reply boom on server/routes/users
 * TODO: make login with linkedin, fb, twitter, etc.
 * TODO: add tests, AVA looks good
 * 
 */
