'use strict'

const Boom  = require('boom')
const Movie = require('../models/Movie')

module.exports = function (request, reply) {
  Movie
    .query()
    .findById(request.params.id)
    .then(function (movie) {
      if (!movie) {
        throw Boom.notFound('Movie id=(' + request.params.id + ') not found!')
      }
      return movie
        .$relatedQuery('actors')
        .relate(request.payload.id)
    })
    .then(function () {
      reply(request.payload)
    })
    .catch(function (error) {
      if (error.isBoom) {
        reply(error)
        return
      }
      reply(Boom.badImplementation(error))
    })
}
