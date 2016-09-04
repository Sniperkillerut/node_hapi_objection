'use strict'

const Boom        = require('boom')
const transaction = require('objection').transaction
const Person      = require('../api/models/Person')
const Movie       = require('../api/models/Movie')

const createPersonConfig     = require('../api/config/createPerson')
const updatePersonConfig     = require('../api/config/updatePerson')
const getAllPersonsConfig    = require('../api/config/getAllPersons')
const deletePersonConfig     = require('../api/config/deletePerson')
const addChildToPersonConfig = require('../api/config/addChildToPerson')
const addPetToPersonConfig   = require('../api/config/addPetToPerson')
const getPersonPetsConfig    = require('../api/config/getPersonPets')
const createMovieConfig      = require('../api/config/createMovie')
const addPersonToMovieConfig = require('../api/config/addPersonToMovie')
const getMovieActorsConfig   = require('../api/config/getMovieActors')

module.exports = [
  {
    config: createPersonConfig,
    method: 'POST',
    path: '/api/persons',
    handler: function (request, reply) {
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
  },
  {
    config: updatePersonConfig,
    method: 'PATCH',
    path: '/api/persons/{id}',
    handler: function (request, reply) {
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
  },
  {
    config: getAllPersonsConfig,
    method: 'GET',
    path: '/api/persons',
    handler: function (request, reply) {
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
  },
  {
    config: deletePersonConfig,
    method: 'DELETE',
    path: '/api/persons/{id}',
    handler: function (request, reply) {
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
  },
  {
    config: addChildToPersonConfig,
    method: 'POST',
    path: '/api/persons/{id}/children',
    handler: function (request, reply) {
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
  },
  {
    config: addPetToPersonConfig,
    method: 'POST',
    path: '/api/persons/{id}/pets',
    handler: function (request, reply) {
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
  },
  {
    config: getPersonPetsConfig,
    method: 'GET',
    path: '/api/persons/{id}/pets',
    handler: function (request, reply) {
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
  },
  {
    config: createMovieConfig,
    method: 'POST',
    path: '/api/persons/{id}/movies',
    handler: function (request, reply) {
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
  },
  {
    config: addPersonToMovieConfig,
    method: 'POST',
    path: '/api/movies/{id}/actors',
    handler: function (request, reply) {
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
  },
  {
    config: getMovieActorsConfig,
    method: 'GET',
    path: '/api/movies/{id}/actors',
    handler: function (request, reply) {
      Movie
        .query()
        .findById(request.params.id)
        .then(function (movie) {
          if (!movie) {
            throw Boom.notFound('Movie id=(' + request.params.id + ') not found!')
          }
          return movie.$relatedQuery('actors')
        })
        .then(function (actors) {
          reply(actors)
        })
        .catch(function (error) {
          if (error.isBoom) {
            reply(error)
            return
          }
          reply(Boom.badImplementation(error))
        })
    }
  }
]
