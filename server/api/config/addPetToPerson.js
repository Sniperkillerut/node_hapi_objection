'use strict'

const errors          = require('../../config/errors')
const ids             = require('../schemas/ids')
const createPetSchema = require('../schemas/createPet')

module.exports = {
  payload: {
    output: 'data',
    parse: true
  },
  validate: {
    params: ids.personID,
    payload: createPetSchema.validate
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
          'schema': createPetSchema.response
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
