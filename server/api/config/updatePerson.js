'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    allow: 'application/json',
    parse: true
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  validate: {
    payload: Joi.object({
      firstName: Joi.string().trim().min(1).max(255).description('Person first Name').example('Jennifer'),
      lastName: Joi.string().min(1).max(255).description('Person first Name').example('Lawrence'),
      age: Joi.number(),
      address: Joi.object({
        street: Joi.string(),
        city: Joi.string(),
        zipCode: Joi.string()
      })
    }).label('Person Update schema').required().min(1),
    params: Joi.object({ id: Joi.number().required().description('Person ID number').example(5) })
  },
  description: 'Update a Person',
  notes: 'Update a Person',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person Updated',
          'schema': Joi.object({
            firstName: Joi.string().min(1).max(255).description('Person first Name').example('Jennifer'),
            lastName: Joi.string().min(1).max(255).description('Person first Name').example('Lawrence'),
            age: Joi.number(),
            parentID: Joi.number(),
            ID: Joi.number(),
            address: Joi.object({
              street: Joi.string(),
              city: Joi.string(),
              zipCode: Joi.string()
            })
          }).label('Person Update schema')
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
