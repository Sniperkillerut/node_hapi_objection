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
    },
    payload: {
      name: Joi.string().min(1).max(255).required().description('Movie Name').example('Rocky V')
    }
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
          'schema': Joi.object({
            name: Joi.string().min(1).max(255).required().description('Movie Name').example('Rocky V'),
            ID: Joi.number()
          }).label('Movie creation schema')
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
