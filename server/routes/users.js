'use strict';

const Boom = require('boom');
const User = require('../users/models/User');
const verifyUniqueUser = require('../users/util/userFunctions').verifyUniqueUser;
const verifyCredentials = require('../users/util/userFunctions').verifyCredentials;
const updateUserSchema = require('../users/schemas/updateUser');
const authenticateUserSchema = require('../users/schemas/authenticateUser');
const createUserSchema = require('../users/schemas/createUser');
const checkUserSchema = require('../users/schemas/checkUser');
const privateKey = require('../config/auth').key.privateKey;
const Joi = require('joi');
const Common = require('../users/util/common');
const Jwt = require('jsonwebtoken');
//had some errors with bcrypt on windows
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
            // Validate the payload against the Joi schema
            validate: {
                payload: createUserSchema
            }
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
                        username: user.username,
                        scope: [user.scope],
                        id: user._id
                    };
                    Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey,{ algorithm: 'HS256', expiresIn: '1h' }));
                    reply({message:'Please confirm your email id by clicking on link in email'});
                } else {
                    if (11000 === err.code || 11001 === err.code) {
                        reply(Boom.forbidden('please provide another user email'));
                    } else reply(Boom.forbidden(err)); // HTTP 403
                }
            });
            //});
        }
    },
    {
        config: {
            auth: false,
            // Check the user's password against the DB
            pre: [
                { method: verifyCredentials, assign: 'user' }
            ],
            validate: {
                payload: authenticateUserSchema
            }
        },
        method: 'POST',
        path: '/api/users/authenticate',
        handler: (request, reply) => {
            // If the user's password is correct, we can issue a token.
            // If it was incorrect, the error will bubble up from the pre method
            var tokenData = {
                username: request.pre.user._doc.username,
                scope: request.pre.user._doc.scope,
                id: request.pre.user._doc._id
            };
            var res = {
                username: request.pre.user._doc.username,
                scope: request.pre.user._doc.scope,
                token: Jwt.sign(tokenData, privateKey,{ algorithm: 'HS256', expiresIn: '1h' } )
            };
            reply(res).code(201);
        }
    },
    {
        config: {
            validate: {
                payload: authenticateUserSchema
            },
        },
        method: 'POST',
        path: '/resendVerificationEmail',
        handler: function(request, reply) {
            User.findOne({
                $or: [ 
                    { email: request.payload.email }, 
                    { username: request.payload.username }
                ]
            }, function(err, user) {
                if (!err) {
                    if (user === null) return reply(Boom.forbidden('invalid username or password'));
                    if (request.payload.password === Common.decrypt(user.password)) {
                        if(user.isVerified) return reply({message:'your email address is already verified'});
                        var tokenData = {
                            username: user.username,
                            scope: [user.scope],
                            id: user._id
                        };
                        Common.sentMailVerificationLink(user,Jwt.sign(tokenData, privateKey,{ algorithm: 'HS256', expiresIn: '1h' } ));
                        reply({message:'account verification link is sucessfully send to an email id'});
                    } else reply(Boom.forbidden('invalid username or password'));
                } else {                
                    console.error(err);
                    return reply(Boom.badImplementation(err));
                }
            });
        }
    },
    {
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().required()
                }
            },
        },
        method: 'POST',
        path: '/forgotPassword',
        handler: function(request, reply) {
            User.findOne({
                email: request.payload.email
            }, function(err, user) {
                if (!err) {
                    if (user === null) return reply(Boom.forbidden('invalid email'));
                    Common.sentMailForgotPassword(user);
                    reply({message:'password is send to registered email id'});
                } else {
                    console.error(err);
                    return reply(Boom.badImplementation(err));
                }
            });
        }
    },
    {
        method: 'GET',
        path: '/verifyEmail/{token}',
        handler: function(request, reply) {
            Jwt.verify(request.params.token, privateKey, function(err, decoded) {
                if(decoded === undefined) return reply(Boom.forbidden('invalid verification link'));
                if(decoded.scope[0] != 'User') return reply(Boom.forbidden('invalid verification link'));
                User.findOne({
                    username: decoded.username,
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
                        return reply({message:'account sucessfully verified'});
                    });
                });
            });
        }
    },
    {
        config: {
            pre: [
                { method: verifyUniqueUser, assign: 'user' }
            ],
            validate: {
                payload: updateUserSchema.payloadSchema,
                params: updateUserSchema.paramsSchema
            },
            auth: {
                strategy: 'jwt',
                scope: 'Admin'
            },
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
    },
    {
        config: {
            auth: {
                // Add authentication to this route
                // The user must have a scope of `admin`
                strategy: 'jwt',
                scope: 'Admin'
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
                    //throw Boom.notFound('No users found!');
                    reply({message:'User not found!'});
                    return;
                }
                reply(users);
            });
        },
    },
    {   
        config: {
            auth: false,
            pre: [
                { method: verifyUniqueUser, assign: 'user' }
            ],
            validate: {
            // Validate the payload against the Joi schema
                payload: checkUserSchema
            },
        },
        method: 'POST',
        path: '/api/users/check',
        handler: (request, reply) => {
            reply(request.pre.user);
        },
    }
];