'use strict'

const Joi = require('joi')
const authenticateUserSchema = require('../users/schemas/authenticateUser')
const errors = require('./errors')

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