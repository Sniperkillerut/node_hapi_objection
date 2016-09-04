'use strict'

const Joi                    = require('joi')
const authenticateUserSchema = require('../users/schemas/authenticateUser')
const verifyCredentials      = require('../users/util/userFunctions').verifyCredentials
const errors                 = require('./errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
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
        '400': errors.e400,
        '403': errors.e403,
        '500': errors.e500  
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}