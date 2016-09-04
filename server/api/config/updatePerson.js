'use strict'

const errors             = require('../../config/errors')
const createPersonSchema = require('../schemas/createPerson')
const ids                = require('../schemas/ids')

module.exports = {
  payload: {
    output: 'data',
    allow: 'application/json',
    parse: true
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  validate: {
    payload: createPersonSchema.update,
    params: ids.personID
  },
  description: 'Update a Person',
  notes: 'Update a Person',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person Updated',
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
