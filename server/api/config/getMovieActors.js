'use strict'

const errors             = require('../../config/errors')
const ids                = require('../schemas/ids')
const createPersonSchema = require('../schemas/createPerson')

module.exports = {
  validate: {
    params: ids.movieID
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Get Movie Actors',
  notes: 'Get Movie Actors',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Get Movie actors',
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
