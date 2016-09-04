'use strict'

const errors = require('../../config/errors')
const ids    = require('../schemas/ids')

module.exports = {
  payload: {
    output: 'data',
    parse: true
  },
  validate: {
    params: ids.personID
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Delete a Person',
  notes: 'Delete a Person',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person deleted',
          'schema': {}
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
