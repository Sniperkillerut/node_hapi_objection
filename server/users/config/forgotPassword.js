'use strict'

const Joi                  = require('joi')
const forgotPasswordSchema = require('../users/schemas/forgotpassword.js')
const errors               = require('./errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
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
        '400': errors.e400,
        '403': errors.e403,
        '500': errors.e500,
        '503': errors.e503
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}