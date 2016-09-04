'use strict'

// had some errors with bcrypt on windows
// function hashPassword(password, cb){
//   // Generate a salt at level 10 strength
//   bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (error, hash) => {
//       return cb(error, hash)
//     })
//   })
// }
const createUserHandler              = require('../users/handlers/createUser')
const authenticateUserHandler        = require('../users/handlers/authenticateUser')
const resendVerificationEmailHandler = require('../users/handlers/resendVerificationEmail')
const forgotPasswordHandler          = require('../users/handlers/forgotPassword')
const verifyEmailHandler             = require('../users/handlers/verifyEmail')
const patchUserHandler               = require('../users/handlers/patchUser')
const getAllUsersHandler             = require('../users/handlers/getAllUsers')

const createUserConfig               = require('../sers/config/createUser')
const authenticateUserConfig         = require('../sers/config/authenticateUser')
const resendVerificationEmailConfig  = require('../sers/config/resendVerificationEmail')
const forgotPasswordConfig           = require('../sers/config/forgotPasswordConfig')
const verifyEmailConfig              = require('../sers/config/verifyEmail')
const patchUserConfig                = require('../sers/config/patchUser')
const getAllUsersConfig              = require('../sers/config/getAllUsers')
const checkUserConfig                = require('../sers/config/checkUser')

module.exports = [
  {
    config:  createUserConfig,
    method:  'POST',
    path:    '/users',
    handler: createUserHandler   
  },
  {
    config:  authenticateUserConfig,
    method:  'POST',
    path:    '/users/authenticate',
    handler: authenticateUserHandler
  },
  {
    config:  resendVerificationEmailConfig ,
    method:  'POST',
    path:    '/users/resendVerificationEmail',
    handler: resendVerificationEmailHandler
  },
  {
    config:  forgotPasswordConfig,
    method:  'POST',
    path:    '/users/forgotPassword',
    handler: forgotPasswordHandler 
  },
  {
    config:  verifyEmailConfig,
    method:  'GET',
    path:    '/users/verifyEmail/{token}',
    handler: verifyEmailHandler   
  },
  {
    config:  patchUserConfig,
    method:  'PATCH',
    path:    '/users/{id}',
    handler: patchUserHandler
  },
  {
    config:  getAllUsersConfig,
    method:  'GET',
    path:    '/users',
    handler: getAllUsersHandler
  },
  {
    config:  checkUserConfig,
    method:  'POST',
    path:    '/users/check',
    handler: (request, reply) => {
      reply(request.pre.user)
    }
  }
]
