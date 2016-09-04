'use strict'

const Boom   = require('boom')
const Person = require('../models/Person')

module.exports = function (request, reply) {
  // Get all Persons. The result can be filtered using query parameters
  // `minAge`, `maxAge` and `firstName`. Relations can be fetched eagerly
  // by giving a relation expression as the `eager` query parameter.
  // We don't need to check for the existence of the query parameters.
  // The query builder methods do nothing if one of the values is undefined.
  Person
    .query()
    .allowEager('[pets, children.[pets, movies], movies]')
    .eager(request.query.eager)
    .where('age', '>=', request.query.minAge)
    .where('age', '<', request.query.maxAge)
    .where('firstName', 'like', request.query.firstName)
    .orderBy('firstName')
    .filterEager('pets', function (builder) {
      // Order eagerly loaded pets by name.
      builder.orderBy('name')
    })
    .filterEager('children.pets', function (builder) {
      // Only fetch dogs for children.
      builder.where('species', 'dog')
    })
    .then(function (persons) {
      reply(persons)
    })
    .catch(function (error) {
      reply(Boom.badImplementation(error))
    })
}
