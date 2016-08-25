'use strict';

const Boom = require('boom');
const User = require('../users/model/User');//.userModel;
const verifyUniqueUser = require('../users/util/userFunctions').verifyUniqueUser;
const verifyCredentials = require('../users/util/userFunctions').verifyCredentials;
const updateUserSchema = require('../users/schemas/updateUser');
const authenticateUserSchema = require('../users/schemas/authenticateUser');
const createUserSchema = require('../users/schemas/createUser');
const checkUserSchema = require('../users/schemas/checkUser');
const privateKey = require('../../config/auth').key.privateKey;
const Joi = require('joi');
const Common = require('../users/util/common');
const Jwt = require('jsonwebtoken');
// function hashPassword(password, cb) {
//   // Generate a salt at level 10 strength
//   bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//       return cb(err, hash);
//     });
//   });
// }
module.exports = [
    {
        config: {
            auth: false,
            // Before the route handler runs, verify that the user is unique
            pre: [
              { method: verifyUniqueUser }
            ],
        },
        method: 'POST',
        path: '/api/users',
        handler: (request, reply) => {
            let user = new User();
            user.email = request.payload.email;
            user.username = request.payload.username;
            user.scope = 'User';
            user.password = Common.encrypt(request.payload.password);
            //hashPassword(req.payload.password, (err, hash) => {
                // if (err) {
                //     throw Boom.badRequest(err);
                // }
                //user.password = hash;
            user.save((err, user) => {
                if (!err) {
                    var tokenData = {
                        userName: user.userName,
                        scope: [user.scope],
                        id: user._id
                    };
                    Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey,{ algorithm: 'HS256', expiresIn: '1h' }));
                    reply('Please confirm your email id by clicking on link in email');
                } else {
                    if (11000 === err.code || 11001 === err.code) {
                        reply(Boom.forbidden('please provide another user email'));
                    } else reply(Boom.forbidden(err)); // HTTP 403
                }
            });
            //});
        },
        // Validate the payload against the Joi schema
        validate: {
            payload: createUserSchema
        }
    },
    {
        config: {
            auth: false,
            // Check the user's password against the DB
            pre: [
                { method: verifyCredentials, assign: 'user' }
            ],
        },
        method: 'POST',
        path: '/api/users/authenticate',
        handler: (request, reply) => {
            // If the user's password is correct, we can issue a token.
            // If it was incorrect, the error will bubble up from the pre method
            var tokenData = {
                userName: request.user.userName,
                scope: [request.user.scope],
                id: request.user._id
            };
            var res = {
                username: request.user.userName,
                scope: request.user.scope,
                token: Jwt.sign(tokenData, privateKey,{ algorithm: 'HS256', expiresIn: '1h' } )
            };
            reply(res).code(201);
        },
        validate: {
            payload: authenticateUserSchema
        }
    },
    {
        validate: {
            payload: {
                userName: Joi.string().email().required(),
                password: Joi.string().required()
            }
        },
        method: 'POST',
        path: '/resendVerificationEmail',
        handler: function(request, reply) {
            User.findOne({
                userName: request.payload.userName
            }, function(err, user) {
                if (!err) {
                    if (user === null) return reply(Boom.forbidden('invalid username or password'));
                    if (request.payload.password === Common.decrypt(user.password)) {
                        if(user.isVerified) return reply('your email address is already verified');
                        var tokenData = {
                            userName: user.userName,
                            scope: [user.scope],
                            id: user._id
                        };
                        Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey,{ algorithm: 'HS256', expiresIn: '1h' } ));
                        reply('account verification link is sucessfully send to an email id');
                    } else reply(Boom.forbidden('invalid username or password'));
                } else {                
                    console.error(err);
                    return reply(Boom.badImplementation(err));
                }
            });
        }
    },
    {
        validate: {
            payload: {
                userName: Joi.string().email().required()
            }
        },
        method: 'POST',
        path: '/forgotPassword',
        handler: function(request, reply) {
            User.findOne({
                userName: request.payload.userName
            }, function(err, user) {
                if (!err) {
                    if (user === null) return reply(Boom.forbidden('invalid username'));
                    Common.sentMailForgotPassword(user);
                    reply('password is send to registered email id');
                } else {
                    console.error(err);
                    return reply(Boom.badImplementation(err));
                }
            });
        }
    },
    {
        method: 'POST',
        path: '/verifyEmail',
        handler: function(request, reply) {
            Jwt.verify(request.headers.authorization.split(' ')[1], privateKey, function(err, decoded) {
                if(decoded === undefined) return reply(Boom.forbidden('invalid verification link'));
                if(decoded.scope[0] != 'User') return reply(Boom.forbidden('invalid verification link'));
                User.findOne({
                    userName: decoded.userName,
                    _id: decoded.id
                }, function(err, user){
                    if (err) {
                        console.error(err);
                        return reply(Boom.badImplementation(err));
                    }
                    if (user === null) return reply(Boom.forbidden('invalid verification link'));
                    if (user.isVerified === true) return reply(Boom.forbidden('account is already verified'));
                    user.isVerified = true;
                    user.save(function(err){
                        if (err) {
                            console.error(err);
                            return reply(Boom.badImplementation(err));
                        }
                        return reply('account sucessfully verified');
                    });
                });
            });
        }
    },
    {
        validate: {
            payload: updateUserSchema.payloadSchema,
            params: updateUserSchema.paramsSchema
        },
        config: {
            pre: [
                { method: verifyUniqueUser, assign: 'user' }
            ],
        },
        method: 'PATCH',
        path: '/api/users/{id}',
        handler: (request, reply) => {
            const id = request.params.id;
            User
            .findOneAndUpdate({ _id: id }, request.pre.user, (err, user) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                if (!user) {
                    throw Boom.notFound('User not found!');
                }
                reply({message: 'User updated!'});
            });      
        },        
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    },
    {
        config: {
            auth: {
                // Add authentication to this route
                // The user must have a scope of `admin`
                strategy: 'jwt',
                scope: ['admin']
            }
        },
        method: 'GET',
        path: '/api/users',
        handler: (request, reply) => {
            User
            .find()
            // Deselect the password and version fields
            .select('-password -__v')
            .exec((err, users) => {
                if (err) {
                    throw Boom.badRequest(err);
                }
                if (!users.length) {
                    throw Boom.notFound('No users found!');
                }
                reply(users);
            });
        },
    },
    {
        // Validate the payload against the Joi schema
        validate: {
            payload: checkUserSchema
        },
        config: {
            auth: false,
            pre: [
                { method: verifyUniqueUser, assign: 'user' }
            ]
        },
        method: 'POST',
        path: '/api/users/check',
        handler: (request, reply) => {
            reply(request.pre.user);
        },
    }
];