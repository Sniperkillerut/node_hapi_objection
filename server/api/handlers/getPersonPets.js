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
      // We don't need to check for the existence of the query parameters.
      // The query builder methods do nothing if one of the values is undefined.
      return person
        .$relatedQuery('pets')
        .where('name', 'like', request.query.name)
        .where('species', request.query.species)
    })
    .then(function (pets) {
      reply(pets)
    })
    .catch(function (error) {
      if (error.isBoom) {
        reply(error)
        return
      }
      reply(Boom.badImplementation(error))
    })
}
