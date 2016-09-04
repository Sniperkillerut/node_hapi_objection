'use strict'

const Joi    = require('joi')
const errors = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  auth: false,
  // auth: {
  //   strategy: 'jwt',
  // },
  validate: {
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
  description: 'Create a new Person',
  notes: 'Create a new Person',
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
        '500': errors.e500
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}
