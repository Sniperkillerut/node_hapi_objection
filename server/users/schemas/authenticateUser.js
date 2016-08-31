'use strict'

const Joi = require('joi')

const authenticateUserSchema = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required().description('The user unique Username').example('andresvega'),
    password: Joi.string().required().description('A secure password is recommended').example('AV1578sj')
  }).label('Authenticate Username & Password'),
  Joi.object({
    email:    Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
    password: Joi.string().required().description('A secure password is recommended').example('AV1578sj')
  }).label('Authenticate Email & password')
).label('Authenticate User')

module.exports = authenticateUserSchema
