'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const payloadSchema = Joi.object({
  username: Joi.string().alphanum().min(2).max(30).description('The user unique Username').example('andresvega').optional(),
  email: Joi.string().email().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
  password: Joi.string().description('A secure password is recommended').example('AV1578sj'),
  scope: Joi.string().allow('User', 'Premium', 'Admin').description('The account scope, enum').example('User'),
  jwt: Joi.string().description('jwt').example('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ').label('jwt')
}).label('Update User')

const paramsSchema = Joi.object({
  // id: Joi.number().integer().required(),
  id: Joi.objectId().required().description('Must match a 24 chars objectid')
})

const headerSchema = Joi.object({
  authorization: Joi.string().required().description('JWT Bearer').default('Bearer {JWT}')
}).unknown()
module.exports = {
  payloadSchema: payloadSchema,
  paramsSchema: paramsSchema,
  headerSchema: headerSchema
}
