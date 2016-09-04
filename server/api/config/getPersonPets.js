'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')

module.exports = {
  validate: {
    params: {
      id: Joi.number().integer().required()
    },
    query: {
      species: Joi.string(),
      name: Joi.string()
    }
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Get person pets',
  notes: 'Get person pets',
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
        }).label('Pet schema')            },
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
