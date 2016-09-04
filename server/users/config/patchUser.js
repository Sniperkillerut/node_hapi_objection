'use strict'

const Joi              = require('joi')
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser
const updateUserSchema = require('../schemas/updateUser')
const errors           = require('./errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
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
        '400': errors.e400,
        '401': errors.e401,
        '404': errors.e404,
        '500': errors.e500
      },
      payloadType: 'json',
      security: [{ 'jwt': [] }]
    }
  }
}