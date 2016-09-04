'use strict'

const Boom   = require('boom')
const Person = require('../models/Person')

module.exports = function (request, reply) {
  Person
    .query()
    .findById(request.params.id)
    .then(function (person) {
      if (!person) {
        throw Boom.notFound('Person id=(' + request.params.id + ') not found!')
      }
      return person
        .$relatedQuery('pets')
        .insert(request.payload)
    })
    .then(function (pet) {
      reply(pet)
    })
    .catch(function (error) {
      if (error.isBoom) {
        reply(error)
        return
      }
      reply(Boom.badImplementation(error))
    })
}
