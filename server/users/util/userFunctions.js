'use strict';

const Boom = require('boom');
const User = require('../models/User');
//const Jwt = require('jsonwebtoken');
const Common = require('./common');
//const bcrypt = require('bcrypt');

function verifyUniqueUser(request, reply){
    // Find an entry from the database that
    // matches either the email or username
    User.findOne({ 
        $or: [ 
            { email: request.payload.email }, 
            { username: request.payload.username }
        ]
    }, (err, user) => {
        // Check whether the username or email
        // is already taken and error out if so
        if (user){
            if (user.username === request.payload.username){
                reply(Boom.badRequest('Username taken'));
                return;
            }
            if (user.email === request.payload.email){
                reply(Boom.badRequest('Email taken'));
                return;
            }
        }
        // If everything checks out, send the payload through
        // to the route handler
        reply(request.payload);
    });
}

function verifyCredentials(request, reply){
    //const password = request.payload.password;
    // Find an entry from the database that
    // matches either the email or username
    User.findOne({ 
        $or: [ 
            { email: request.payload.email },
            { username: request.payload.username }
        ]
    }, (err, user) => {
        //     if (user){
        //   bcrypt.compare(password, user.password, (err, isValid) => {
        //     if (isValid){
        //       res(user);
        //     }
        //     else {
        //       res(Boom.badRequest('Incorrect password!'));
        //     }
        //   });
        // }else{
        //   res(Boom.badRequest('Incorrect username or email!'));
        // }
        if (!err){
            if (user === null) return reply(Boom.forbidden('invalid username or password'));
            if (request.payload.password === Common.decrypt(user.password)){
                if(!user.isVerified) return reply('Your email address is not verified. please verify your email address to proceed');
                reply(user);
            } else reply(Boom.forbidden('invalid username or password'));
        }else{
            if (11000 === err.code || 11001 === err.code){
                reply(Boom.forbidden('please provide another user email'));
            }else{
                console.error(err);
                return reply(Boom.badImplementation(err));
            } 
        }
    });
}

function createToken(tokenData){
    let Jwt = require('jsonwebtoken');
    let privateKey = require('../../config/auth').key.privateKey;
    let a = Common.encrypt(''+tokenData.username);
    let b = Common.encrypt(''+tokenData.scope);
    let c = Common.encrypt(''+tokenData.id);
    let d = a+";"+b+";"+c
    let e = Common.encrypt(''+d);
    let f = { hash: e}
    return Jwt.sign(f, privateKey,{ algorithm: 'HS256', expiresIn: '1h' });
};
function decyptToken(token){
    let hash = token.hash;
    let a = Common.decrypt(hash);
    let b = a.split(';');
    let username = Common.decrypt(b[0]);
    let scope = Common.decrypt(b[1]);
    let id = Common.decrypt(b[2]);
    debugger;
    let decoded = {
        exp: token.exp,
        username: username,
        scope: scope,
        id: id,
        iat: token.iat
    }
    return decoded;
}
module.exports = {
    verifyUniqueUser: verifyUniqueUser,
    verifyCredentials: verifyCredentials,
    createToken: createToken,
    decyptToken:decyptToken 
};