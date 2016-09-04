'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')

module.exports = {
  validate: {
    query: {
      minAge: Joi.number().integer(),
      maxAge: Joi.number().integer(),
      firstName: Joi.string().alphanum(),
      eager: Joi.string()
    }
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  description: 'Get all Persons',
  notes: 'Get all Persons',
  tags: ['api', 'app'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Person ',
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
          }).label('Person schema')
        },
        '400': errors.e400,
        '401': errors.e401,
        // Should send a 404?, or with the [] is alright?
        '500': errors.e500 
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}
