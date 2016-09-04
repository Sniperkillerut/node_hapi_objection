'use strict'

const errors            = require('../../config/errors')
const createMovieSchema = require('../schemas/createMovie')
const ids               = require('../schemas/ids')

module.exports = {
  payload: {
    output: 'data',
    parse: true
  },
  validate: {
    params: ids.personID,
    payload: createMovieSchema.validate
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Create a new movie and add it to a Person',
  notes: 'Create a new movie and add it to a Person',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Movie creation schema',
          'schema': createMovieSchema.response
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
