'use strict'

const Joi = require('joi')

const validate = Joi.object({
  firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
  lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
  age: Joi.number(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    zipCode: Joi.string()
  })
}).label('Person creation schema')

const response = Joi.object({
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

const getPersonsValidate = Joi.object({
  minAge: Joi.number().integer(),
  maxAge: Joi.number().integer(),
  firstName: Joi.string().alphanum(),
  eager: Joi.string()
})
const update = Joi.object({
  firstName: Joi.string().min(1).max(255).description('Person first Name').example('Jennifer'),
  lastName: Joi.string().min(1).max(255).description('Person first Name').example('Lawrence'),
  age: Joi.number(),
  parentID: Joi.number(),
  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    zipCode: Joi.string()
  })
}).label('Person Update schema').required().min(1)

module.exports = {
  validate: validate,
  response: response,
  get:      getPersonsValidate,
  update:   update
}
