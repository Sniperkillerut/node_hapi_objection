'use strict'

const Joi              = require('joi')
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser
const createUserSchema = require('../schemas/createUser')
const errors           = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
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
        '400': errors.e400,
        '500': errors.e500,
        '503': errors.e503
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}