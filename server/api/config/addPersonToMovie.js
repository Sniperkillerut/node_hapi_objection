'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true
  },
  validate: {
    params: {
      id: Joi.number().integer().required().description('Movie ID')
    },
    payload: {
      id: Joi.number().integer().required().description('Person ID')
    }
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
          'schema': Joi.object({
            id: Joi.number().integer().required().description('Person ID')
          }).label('Person add to movie schema')
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
