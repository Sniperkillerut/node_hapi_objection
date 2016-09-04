'use strict'

const errors          = require('../../config/errors')
const createPetSchema = require('../schemas/createPet')
const ids             = require('../schemas/ids')

module.exports = {
  validate: {
    params: ids.personID,
    query: createPetSchema.validate
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
