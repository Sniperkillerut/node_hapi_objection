'use strict'

const errors             = require('../../config/errors')
const createPersonSchema = require('../schemas/createPerson')
const ids                = require('../schemas/ids')

module.exports = {
  payload: {
    output: 'data',
    parse: true
  },
  validate: {
    params: ids.personID,
    payload: createPersonSchema.validate
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Add a child to Person',
  notes: 'Add a child to Person',
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
        '404': errors.e404,
        '500': errors.e500
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}
