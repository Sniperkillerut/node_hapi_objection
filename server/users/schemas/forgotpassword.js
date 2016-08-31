'use strict'

const Joi = require('joi')

const forgotPasswordSchema = Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required().description('The user unique Username').example('andresvega'),
  }).label('Forgot Password with Username'),
  Joi.object({
    email: Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
  }).label('Forgot Password with Email')
).label('Forgot Password')

module.exports = forgotPasswordSchema
