'use strict'

const Boom                   = require('boom')
const Joi                    = require('joi')
const Jwt                    = require('jsonwebtoken')
const User                   = require('../users/models/User')
const verifyUniqueUser       = require('../users/util/userFunctions').verifyUniqueUser
const verifyCredentials      = require('../users/util/userFunctions').verifyCredentials
const createToken            = require('../users/util/userFunctions').createToken
const decyptToken            = require('../users/util/userFunctions').decyptToken
const Common                 = require('../users/util/common')
const updateUserSchema       = require('../users/schemas/updateUser')
const authenticateUserSchema = require('../users/schemas/authenticateUser')
const createUserSchema       = require('../users/schemas/createUser')
const checkUserSchema        = require('../users/schemas/checkUser')
const forgotPasswordSchema   =  require('../users/schemas/forgotpassword.js')
// had some errors with bcrypt on windows
// function hashPassword(password, cb){
//   // Generate a salt at level 10 strength
//   bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (error, hash) => {
//       return cb(error, hash)
//     })
//   })
// }
module.exports = [
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      pre: [
        // Before the route handler runs, verify that the user is unique
        { method: verifyUniqueUser }
      ],
      validate: {
        // Validate the payload against the Joi schema
        payload: createUserSchema
      },
      description: 'Create a new User',
      notes: 'Create a new user, all parameters are required, confirmation email will be sent, use a valid email',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Account created, please confirm your email by clicking the link in the email we sent you',
              'schema': Joi.object({
                message: Joi.string().required().description('Success message').default('Please confirm your email id by clicking on link in email')
              }).label('Success')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
    method: 'POST',
    path: '/users',
    handler: (request, reply) => {
      let user = new User()
      user.email = request.payload.email
      user.username = request.payload.username
      user.scope = 'User'
      user.password = Common.encrypt(request.payload.password)
      // hashPassword(req.payload.password, (error, hash) => {
      // if (error){
      //     reply( Boom.badRequest(error))
      //     return
      // }
      // user.password = hash
      user.save((error, user) => {
        if (!error) {
          var tokenData = {
            username: user.username,
            scope: [user.scope],
            id: user._id
          }
          Common.sentMailVerificationLink(user, createToken(tokenData))
          reply({message: 'Please confirm your email id by clicking on link in email'})
        }else {
          if (11000 === error.code || 11001 === error.code) {
            reply(Boom.forbidden('please provide another user email'))
          } else {
            console.log(error)
            reply(Boom.forbidden(error)) // HTTP 403 //why?
          }
        }
      })
    // })
    }
  },
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: false,
      pre: [
        // Check the user's password against the DB
        { method: verifyCredentials, assign: 'user' }
      ],
      validate: {
        payload: authenticateUserSchema
      },
      description: 'Authenticate (Log-in) a User',
      notes: 'Authenticate a user, Username & Password or Email & Password required',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              'description': 'User Authenticated, check response with JWT API Token',
              'schema': Joi.object({
                username: Joi.string().required().description('username').default('juangarcia'),
                scope: Joi.string().required().description('User Scope').default('User'),
                token: Joi.string().required().description('JWT').default('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ')
              }).label('Loged-in')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '403': {
              'description': 'Forbidden',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(403),
                error: Joi.string().required().description('Error type').default('Forbidden'),
                message: Joi.string().required().description('Error message').default('invalid username or password')
              }).label('Forbidden')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
    method: 'POST',
    path: '/users/authenticate',
    handler: (request, reply) => {
      // If the user's password is correct, we can issue a token.
      // If it was incorrect, the error will bubble up from the pre method
      // "Your email address is not verified. please verify your email address to proceed"
      if (request.pre.user === 'Your email address is not verified. please verify your email address to proceed') {
        reply(Boom.forbidden('Your email address is not verified. please verify your email address to proceed')) // HTTP 403 
        return
      }
      var tokenData = {
        username: request.pre.user._doc.username,
        scope: request.pre.user._doc.scope,
        id: request.pre.user._doc._id
      }
      var res = {
        username: request.pre.user._doc.username,
        scope: request.pre.user._doc.scope,
        token: createToken(tokenData)
      }
      reply(res).code(201)
    }
  },
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: false,
      validate: {
        payload: authenticateUserSchema
      },
      description: 'Re-Send verification Email',
      notes: 'Re-Send verification Email, Username & Password or Email & Password required',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'verification Email sent to the account email',
              'schema': Joi.object({
                message: Joi.string().required().description('message').default('account verification link is sucessfully send to an email id')
              }).label('verification email sent')
            },
            '201': {
              'description': 'Account already verified',
              'schema': Joi.object({
                message: Joi.string().required().description('message').default('your email address is already verified')
              }).label('Account already verified')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '403': {
              'description': 'Forbidden',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(403),
                error: Joi.string().required().description('Error type').default('Forbidden'),
                message: Joi.string().required().description('Error message').default('invalid username or password')
              }).label('Forbidden')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }

    },
    method: 'POST',
    path: '/users/resendVerificationEmail',
    handler: function (request, reply) {
      User.findOne({
        $or: [
          { email: request.payload.email },
          { username: request.payload.username }
        ]
      }, function (error, user) {
        if (!error) {
          if (user === null) {
            reply(Boom.forbidden('invalid username or password'))
            return
          }
          if (request.payload.password === Common.decrypt(user.password)) {
            if (user.isVerified) {
              reply({message: 'your email address is already verified'}).code(201)
              return
            }
            var tokenData = {
              username: user.username,
              scope: [user.scope],
              id: user._id
            }
            Common.sentMailVerificationLink(user, createToken(tokenData))
            reply({message: 'account verification link is sucessfully send to an email id'})
          }else {
            reply(Boom.forbidden('invalid username or password'))
          }
        }else {
          console.error(error)
          reply(Boom.badImplementation(error))
        }
      })
    }
  },
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: false,
      validate: {
        payload: forgotPasswordSchema
      },
      description: 'Forgot Password',
      notes: 'Send password reset link to email, Username or Email required',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Password reset link sent to registered email',
              'schema': Joi.object({
                message: Joi.string().required().description('message').default('password is sent to registered email')
              }).label('verification email sent')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '403': {
              'description': 'Forbidden',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(403),
                error: Joi.string().required().description('Error type').default('Forbidden'),
                message: Joi.string().required().description('Error message').default('invalid username or email')
              }).label('Forbidden')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
    method: 'POST',
    path: '/users/forgotPassword',
    handler: function (request, reply) {
      User.findOne({
        $or: [
          { email: request.payload.email },
          { username: request.payload.username }
        ]
      }, function (error, user) {
        if (!error) {
          if (user === null) {
            reply(Boom.forbidden('invalid username or email'))
            return
          }
          Common.sentMailForgotPassword(user)
          reply({message: 'password is sent to registered email'})
        }else {
          console.error(error)
          reply(Boom.badImplementation(error))
        }
      })
    }
  },
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: false,
      validate: {
        params: Joi.object({ token: Joi.string().required().description('JWT').default('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ')}).label('JWT')
      },
      description: 'Verify Account',
      notes: 'Verify account with JWT',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Account sucessfully verified',
              'schema': Joi.object({
                message: Joi.string().required().description('message').default('account sucessfully verified')
              }).label('account sucessfully verified')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '403': {
              'description': 'Forbidden',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(403),
                error: Joi.string().required().description('Error type').default('Forbidden'),
                message: Joi.string().required().description('Error message').default('invalid verification link')
              }).label('Forbidden')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
        // payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
    method: 'GET',
    path: '/users/verifyEmail/{token}',
    handler: function (request, reply) {
      let privateKey = require('../config/auth').key.privateKey
      Jwt.verify(request.params.token, privateKey, function (error, decoded) {
        if (decoded === undefined) {
          reply(Boom.forbidden('invalid verification link'))
          return
        }
        decoded = decyptToken(decoded)
        if (decoded.scope[0] != 'User') {
          reply(Boom.forbidden('invalid verification link'))
          return
        }
        User.findOne({
          username: decoded.username,
          _id: decoded.id
        }, function (error, user) {
          if (error) {
            console.error(error)
            reply(Boom.badImplementation(error))
            return
          }
          if (user === null) {
            reply(Boom.forbidden('invalid verification link'))
            return
          }
          if (user.isVerified === true) {
            reply(Boom.forbidden('account is already verified'))
            return
          }
          user.isVerified = true
          user.save(function (error) {
            if (error) {
              console.error(error)
              reply(Boom.badImplementation(error))
              return
            }
            reply({message: 'account sucessfully verified'})
            return
          })
        })
      })
    }
  },
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      pre: [
        { method: verifyUniqueUser, assign: 'user' }
      ],
      validate: {
        payload: updateUserSchema.payloadSchema,
        params: updateUserSchema.paramsSchema,
        headers: updateUserSchema.headerSchema
      },
      auth: {
        strategy: 'jwt',
        scope: 'Admin'
      },
      description: 'Patch user',
      notes: 'Edit User, Can Edit username, email, scope and/or jwt (for revocation pruposes)  Require \'Admin\' scope',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'User updated',
              'schema': Joi.object({
                message: Joi.string().required().description('message').default('User updated!')
              }).label('User updated')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('User id=({id}) not found!')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'form',
          security: [{ 'jwt': [] }]
        }
      }
    },
    method: 'PATCH',
    path: '/users/{id}',
    handler: (request, reply) => {
      const id = request.params.id
      User
        .findOneAndUpdate({ _id: id }, request.pre.user, (error, user) => {
          if (error) {
            reply(Boom.badRequest(error))
            return
          }
          if (!user) {
            reply(Boom.notFound('User id=(' + request.params.id + ') not found!'))
            return
          }
          reply({message: 'User updated!'})
          if (request.params.email) {
            // send verification email to the new email if the email was updated
            var tokenData = {
              username: user.username,
              scope: [user.scope],
              id: user._id
            }
            Common.sentMailVerificationLink(user, createToken(tokenData))
          }
        })
    }
  },
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: {
        // Add authentication to this route
        // The user must have a scope of `admin`
        strategy: 'jwt',
        scope: 'Admin'
      },
      validate: {
        headers: updateUserSchema.headerSchema
      },
      description: 'Get all users information',
      notes: 'Get information of all users, except password and version Require \'Admin\' scope',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Users information',
              'schema': Joi.object([{
                _id: Joi.objectId().required().description('id').example('123ADBF526DFA896AFC85204'),
                scope: Joi.string().required().allow('User', 'Premium', 'Admin').description('The account scope, enum').example('User'),
                username: Joi.string().alphanum().min(2).max(30).required().description('The user unique Username').example('andresvega'),
                email: Joi.string().required().email().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
                jwt: Joi.string().required().description('jwt').example('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ').label('jwt'),
                isVerified:Joi.boolean().required().description('If the email is verified').example(true)
              }]).label('User information')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('No users Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'form',
          security: [{ 'jwt': [] }]
        }
      }
    },
    method: 'GET',
    path: '/users',
    handler: (request, reply) => {
      User
        .find()
        // Deselect the password and version fields
        .select('-password -__v')
        .exec((error, users) => {
          if (error) {
            reply(Boom.badRequest(error))
            return
          }
          if (!users.length) {
            reply(Boom.notFound('No users found!'))
            return
          }
          reply(users)
        })
    }
  },
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: false,
      pre: [
        { method: verifyUniqueUser, assign: 'user' }
      ],
      validate: {
        // Validate the payload against the Joi schema
        payload: checkUserSchema
      },
      description: 'Check user information',
      notes: 'Check if the username or email are already taken',
      tags: ['api', 'users'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'User information',
              'schema': Joi.alternatives().try(
                Joi.object({
                  username: Joi.string().alphanum().min(2).max(30).required().description('The user unique Username').example('andresvega'),
                }).label('User information'),
                Joi.object({
                  email: Joi.string().required().email().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
                }).label('User information')
              )  
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message').default('Username taken')
              }).label('Bad Request')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
          // security: [{ 'jwt': [] }]
        }
      }
    },
    method: 'POST',
    path: '/users/check',
    handler: (request, reply) => {
      reply(request.pre.user)
    }
  }
]
