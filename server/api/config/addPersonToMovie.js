'use strict'

const errors = require('../../config/errors')
const ids    = require('../schemas/ids')

module.exports = {
  payload: {
    output: 'data',
    parse: true
  },
  validate: {
    params: ids.movieID,
    payload: ids.personID
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Add Person to Movie',
  notes: 'Add Person to Movie',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person added to movie',
          'schema': ids.personID
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
