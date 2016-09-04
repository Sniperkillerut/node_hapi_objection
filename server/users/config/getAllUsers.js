'use strict'

const Joi              = require('joi')
const updateUserSchema = require('../schemas/updateUser')
const errors           = require('../../config/errors')

module.exports = {
  auth: {
    // Add authentication to this route
    // The user must have a scope of `admin`
    strategy: 'jwt',
    scope: 'Admin'
  },
  validate: {
    headers: updateUserSchema.headerSchema
  },
  description: 'Get all users information',
  notes: 'Get information of all users, except password and version Require \'Admin\' scope',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Users information',
          'schema': Joi.object([{
            _id: Joi.objectId().required().description('id').example('123ADBF526DFA896AFC85204'),
            scope: Joi.string().required().allow('User', 'Premium', 'Admin').description('The account scope, enum').example('User'),
            username: Joi.string().alphanum().min(2).max(30).required().description('The user unique Username').example('andresvega'),
            email: Joi.string().required().email().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
            jwt: Joi.string().required().description('jwt').example('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ').label('jwt'),
            isVerified: Joi.boolean().required().description('If the email is verified').example(true)
          }]).label('User information')
        },
        '400': errors.e400,
        '401': errors.e401,
        '404': errors.e404,
        '500': errors.e500
      },
      payloadType: 'json',
      security: [{ 'jwt': [] }]
    }
  }
}