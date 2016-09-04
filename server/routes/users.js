'use strict'

//Import Handlers
const createUserHandler              = require('../users/handlers/createUser')
const authenticateUserHandler        = require('../users/handlers/authenticateUser')
const resendVerificationEmailHandler = require('../users/handlers/resendVerificationEmail')
const forgotPasswordHandler          = require('../users/handlers/forgotPassword')
const verifyEmailHandler             = require('../users/handlers/verifyEmail')
const patchUserHandler               = require('../users/handlers/patchUser')
const getAllUsersHandler             = require('../users/handlers/getAllUsers')

//Import Configs
const createUserConfig               = require('../users/config/createUser')
const authenticateUserConfig         = require('../users/config/authenticateUser')
const resendVerificationEmailConfig  = require('../users/config/resendVerificationEmail')
const forgotPasswordConfig           = require('../users/config/forgotPassword')
const verifyEmailConfig              = require('../users/config/verifyEmail')
const patchUserConfig                = require('../users/config/patchUser')
const getAllUsersConfig              = require('../users/config/getAllUsers')
const checkUserConfig                = require('../users/config/checkUser')

module.exports = [
  {
    method:  'POST',
    path:    '/users',
    config:  createUserConfig,
    handler: createUserHandler   
  },
  {
    method:  'POST',
    path:    '/users/authenticate',
    config:  authenticateUserConfig,
    handler: authenticateUserHandler
  },
  {
    method:  'POST',
    path:    '/users/resendVerificationEmail',
    config:  resendVerificationEmailConfig ,
    handler: resendVerificationEmailHandler
  },
  {
    method:  'POST',
    path:    '/users/forgotPassword',
    config:  forgotPasswordConfig,
    handler: forgotPasswordHandler 
  },
  {
    method:  'GET',
    path:    '/users/verifyEmail/{token}',
    config:  verifyEmailConfig,
    handler: verifyEmailHandler   
  },
  {
    method:  'PATCH',
    path:    '/users/{id}',
    config:  patchUserConfig,
    handler: patchUserHandler
  },
  {
    method:  'GET',
    path:    '/users',
    config:  getAllUsersConfig,
    handler: getAllUsersHandler
  },
  {
    method:  'POST',
    path:    '/users/check',
    config:  checkUserConfig,
    handler: (request, reply) => {
      reply(request.pre.user)
    }
  }
]
