'use strict'

const errors             = require('../../config/errors')
const createPersonSchema = require('../schemas/createPerson')

module.exports = {
  validate: {
    query: createPersonSchema.get
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Get all Persons',
  notes: 'Get all Persons',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person ',
          'schema': createPersonSchema.response
        },
        '400': errors.e400,
        '401': errors.e401,
        // Should send a 404?, or with the [] is alright?
        '500': errors.e500
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}
