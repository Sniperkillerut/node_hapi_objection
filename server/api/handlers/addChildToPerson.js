'use strict'

const Boom   = require('boom')
const Person = require('../api/models/Person')

module.exports = function (request, reply) {
  Person
    .query()
    .findById(request.params.id)
    .then(function (person) {
      if (!person) {
        throw Boom.notFound('Person id=(' + request.params.id + ') not found!')
      }
      return person
        .$relatedQuery('children')
        .insert(request.payload)
    })
    .then(function (child) {
      reply(child)
    })
    .catch(function (error) {
      if (error.isBoom) {
        reply(error)
        return
      }
      reply(Boom.badImplementation(error))
    })
}
