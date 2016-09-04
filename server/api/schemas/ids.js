'use strict'

const Joi = require('joi')

const movieID = Joi.object({
  id: Joi.number().integer().required().description('Movie ID').example(5)
}).description('Movie ID')

const personID = Joi.object({
  id: Joi.number().integer().required().description('person ID').example(5)
}).description('person ID')

module.exports = {
  movieID:  movieID,
  personID: personID
}
