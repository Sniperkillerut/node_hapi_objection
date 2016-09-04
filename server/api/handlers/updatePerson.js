'use strict'

const Boom   = require('boom')
const Person = require('../api/models/Person')

module.exports = function (request, reply) {
  Person
    .query()
    .patchAndFetchById(request.params.id, request.payload)
    .then(function (person) {
      if (person) {
        reply(person)
        return
      }
      reply(Boom.notFound('User not found'))
    })
    .catch(function (error) {
      reply(Boom.badImplementation(error))
    })
}
