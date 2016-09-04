'use strict'

const Boom   = require('boom')
const Person = require('../api/models/Person')

module.exports = function (request, reply) {
  Person
    .query()
    .deleteById(request.params.id)
    .then(function () {
      reply({})
    })
    .catch(function (error) {
      reply(Boom.badImplementation(error))
    })
}
