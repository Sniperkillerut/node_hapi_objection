'use strict'

const Joi = require('joi')

const validate = Joi.object({
  name: Joi.string().min(1).max(255).required().description('Movie Name').example('Rocky V')
}).label('Movie creation schema')

const response = Joi.object({
  name: Joi.string().min(1).max(255).required().description('Movie Name').example('Rocky V'),
  ID: Joi.number()
}).label('Movie creation schema')

module.exports = {
  validate: validate,
  response: response
}
