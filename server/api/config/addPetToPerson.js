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
    payload: Joi.object({
      name: Joi.string().min(1).max(255).required().description('Pet Name').example('Fluffy'),
      species: Joi.string().min(1).max(255).required().description('Pet species').example('Dog')
    }).label('Pet creation schema')
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Add a pet to a Person',
  notes: 'Add a pet to a Person',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person created',
          'schema': Joi.object({
            name: Joi.string().min(1).max(255).required().description('Pet Name').example('Fluffy'),
            species: Joi.string().min(1).max(255).required().description('Pet species').example('Dog'),
            id: Joi.number(),
            ownerID: Joi.number()
          }).label('Pet creation schema')
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
