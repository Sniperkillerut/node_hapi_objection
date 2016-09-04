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
      id: Joi.number().integer().required()
    }
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
          'schema': Joi.object({
          }).label('Person deletion schema')
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
