'use strict'

const Boom   = require('boom')
const Person = require('../api/models/Person')

module.exports = function (request, reply) {
  Person
    .query()
    .insertAndFetch(request.payload)
    .then(function (person) {
      reply(person)
    })
    .catch(function (error) {
      reply(Boom.badImplementation(error))
    })
}
