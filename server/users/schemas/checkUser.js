'use strict'

const Joi = require('joi')

const checkUserSchema =Joi.alternatives().try(
  Joi.object({
    username: Joi.string().alphanum().min(2).max(30).required().description('The user unique Username').example('andresvega'),
  }).label('Check User with Username'),
  Joi.object({
    email: Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
  }).label('Check User with Email')
).label('Check User').description('Checks if the user already exists')
 
module.exports = checkUserSchema
