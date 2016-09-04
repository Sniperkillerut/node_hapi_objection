'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')

module.exports = {
  validate: {
    params: {
      id: Joi.number().integer().required()
    }
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
          'schema': Joi.object({
            firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
            lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
            age: Joi.number(),
            parentID: Joi.number(),
            ID: Joi.number(),
            address: Joi.object({
              street: Joi.string(),
              city: Joi.string(),
              zipCode: Joi.string()
            })
          }).label('Get Movie actors schema')
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
