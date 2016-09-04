'use strict'

const errors             = require('../../config/errors')
const createPersonSchema = require('../schemas/createPerson')

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
  validate: {
    payload: createPersonSchema.validate
  },
  description: 'Create a new Person',
  notes: 'Create a new Person',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person created',
          'schema': createPersonSchema.response
        },
        '400': errors.e400,
        '401': errors.e401,
        '500': errors.e500
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}
