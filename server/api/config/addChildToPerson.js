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
      firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
      lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
      age: Joi.number(),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        zipCode: Joi.string()
      })
    }).label('Person creation schema')

  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Add a child to Person',
  notes: 'Add a child to Person',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person created',
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
          }).label('Person creation schema')
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
