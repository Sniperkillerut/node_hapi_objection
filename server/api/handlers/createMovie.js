'use strict'

const Boom        = require('boom')
const Person      = require('../api/models/Person')
const transaction = require('objection').transaction

module.exports = function (request, reply) {
  // Inserting a movie for a person creates two queries: the movie insert query
  // and the join table row insert query. It is wise to use a transaction here.
  transaction(Person, function (Person) {
    return Person
      .query()
      .findById(request.params.id)
      .then(function (person) {
        if (!person) {
          throw Boom.notFound('Person id=(' + request.params.id + ') not found!')
        }
        return person
          .$relatedQuery('movies')
          .insert(request.payload)
      })
  })
    .then(function (movie) {
      reply(movie)
    })
    .catch(function (error) {
      if (error.isBoom) {
        reply(error)
        return
      }
      reply(Boom.badImplementation(error))
    })
}
