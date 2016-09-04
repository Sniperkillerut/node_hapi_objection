'use strict'

const Joi = require('joi')

const validate = Joi.object({
  name: Joi.string().min(1).max(255).required().description('Pet Name').example('Fluffy'),
  species: Joi.string().min(1).max(255).required().description('Pet species').example('Dog')
}).label('Pet creation schema')

const response = Joi.object({
  name: Joi.string().min(1).max(255).required().description('Pet Name').example('Fluffy'),
  species: Joi.string().min(1).max(255).required().description('Pet species').example('Dog'),
  id: Joi.number(),
  ownerID: Joi.number()
}).label('Pet creation schema')

module.exports = {
  validate: validate,
  response: response
}
