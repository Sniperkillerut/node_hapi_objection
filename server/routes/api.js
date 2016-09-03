'use strict'

const Boom        = require('boom')
const Joi         = require('joi')
const transaction = require('objection').transaction
const Person      = require('../models/Person')
const Movie       = require('../models/Movie')

module.exports = [
  {
    config: {
      payload: {
        output: 'data',
        parse: true,
        allow: 'application/json'
        //maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
        //uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      validate: {
        payload: Joi.object({
          firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
          lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
          age: Joi.number(),
          address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            zipCode: Joi.string()
          })
        }).label('Person creation schema')
      },
      description: 'Create a new Person',
      notes: 'Create a new Person',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person created',
              'schema': Joi.object({
                firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
                lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
                age: Joi.number(),
                parentID: Joi.number(),
                ID:Joi.number(),
                address: Joi.object({
                  street: Joi.string(),
                  city: Joi.string(),
                  zipCode: Joi.string()
                })
              }).label('Person creation schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      payload: {
        output: 'data',
        allow: 'application/json',
        parse: true
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      validate: {
        payload: Joi.object({
          firstName: Joi.string().trim().min(1).max(255).description('Person first Name').example('Jennifer'),
          lastName: Joi.string().min(1).max(255).description('Person first Name').example('Lawrence'),
          age: Joi.number(),
          address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            zipCode: Joi.string()
          })
        }).label('Person Update schema').required().min(1),
        params: Joi.object({ id: Joi.number().required().description('Person ID number').example(5) })
      },
      description: 'Update a Person',
      notes: 'Update a Person',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person Updated',
              'schema': Joi.object({
                firstName: Joi.string().min(1).max(255).description('Person first Name').example('Jennifer'),
                lastName: Joi.string().min(1).max(255).description('Person first Name').example('Lawrence'),
                age: Joi.number(),
                parentID: Joi.number(),
                ID:Joi.number(),
                address: Joi.object({
                  street: Joi.string(),
                  city: Joi.string(),
                  zipCode: Joi.string()
                })
              }).label('Person Update schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('User Not Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      validate: {
        query: {
          minAge: Joi.number().integer(),
          maxAge: Joi.number().integer(),
          firstName: Joi.string().alphanum(),
          eager: Joi.string()
        }
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Get all Persons',
      notes: 'Get all Persons',
      tags: ['api', 'app'],
      plugins: {  
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person ',
              'schema': Joi.object({
                firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
                lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
                age: Joi.number(),
                parentID: Joi.number(),
                ID:Joi.number(),
                address: Joi.object({
                  street: Joi.string(),
                  city: Joi.string(),
                  zipCode: Joi.string()
                })
              }).label('Person schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            //Should send a 404?, or with the [] is alright?
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      payload: {
        output: 'data',
        parse: true
      },
      validate: {
        params: {
          id: Joi.number().integer().required()
        }
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Delete a Person',
      notes: 'Delete a Person',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person deleted',
              'schema': Joi.object({
              }).label('Person deletion schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            // '404': {
            //   'description': 'Not Found',
            //   'schema': Joi.object({
            //     statusCode: Joi.number().required().description('Error Status Code').default(404),
            //     error: Joi.string().required().description('Error type').default('Not Found'),
            //     message: Joi.string().required().description('Error message').default('No users Found')
            //   }).label('Not Found')
            // },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      payload: {
        output: 'data',
        parse: true
      },
      validate: {
        params: {
          id: Joi.number().integer().required()
        },
        payload: Joi.object({
          firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
          lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
          age: Joi.number(),
          address: Joi.object({
            street: Joi.string(),
            city: Joi.string(),
            zipCode: Joi.string()
          })
        }).label('Person creation schema')

      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Add a child to Person',
      notes: 'Add a child to Person',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person created',
              'schema': Joi.object({
                firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
                lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
                age: Joi.number(),
                parentID: Joi.number(),
                ID:Joi.number(),
                address: Joi.object({
                  street: Joi.string(),
                  city: Joi.string(),
                  zipCode: Joi.string()
                })
              }).label('Person creation schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('Person not Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      payload: {
        output: 'data',
        parse: true
      },
      validate: {
        params: {
          id: Joi.number().integer().required()
        },
        payload: Joi.object({
          name: Joi.string().min(1).max(255).required().description('Pet Name').example('Fluffy'),
          species: Joi.string().min(1).max(255).required().description('Pet species').example('Dog'),
        }).label('Pet creation schema')
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Add a pet to a Person',
      notes: 'Add a pet to a Person',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person created',
              'schema': Joi.object({
                name: Joi.string().min(1).max(255).required().description('Pet Name').example('Fluffy'),
                species: Joi.string().min(1).max(255).required().description('Pet species').example('Dog'),
                id: Joi.number(),
                ownerID: Joi.number(),
              }).label('Pet creation schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('Person not Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required()
        },
        query: {
          species: Joi.string(),
          name: Joi.string()
        }
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Create a new Person',
      notes: 'Create a new Person',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person created',
              'schema': Joi.object({
                name: Joi.string().min(1).max(255).required().description('Pet Name').example('Fluffy'),
                species: Joi.string().min(1).max(255).required().description('Pet species').example('Dog'),
                id: Joi.number(),
                ownerID: Joi.number(),
              }).label('Pet schema')            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('Person not Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      payload: {
        output: 'data',
        parse: true
      },
      validate: {
        params: {
          id: Joi.number().integer().required()
        },
        payload: {
          name: Joi.string().min(1).max(255).required().description('Movie Name').example('Rocky V')
        }
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Create a new movie and add it to a Person',
      notes: 'Create a new movie and add it to a Person',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Movie creation schema',
              'schema': Joi.object({
                name: Joi.string().min(1).max(255).required().description('Movie Name').example('Rocky V'),
                ID: Joi.number()
              }).label('Movie creation schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('Person not Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      payload: {
        output: 'data',
        parse: true
      },
      validate: {
        params: {
          id: Joi.number().integer().required().description('Movie ID')
        },
        payload: {
          id: Joi.number().integer().required().description('Person ID')
        }
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Add Person to Movie',
      notes: 'Add Person to Movie',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Person added to movie',
              'schema': Joi.object({
                id: Joi.number().integer().required().description('Person ID')
              }).label('Person add to movie schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('Movie not Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
    config: {
      validate: {
        params: {
          id: Joi.number().integer().required()
        }
      },
      auth: false,
      // auth: {
      //   strategy: 'jwt',
      // },
      description: 'Get Movie Actors',
      notes: 'Get Movie Actors',
      tags: ['api', 'app'],
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Get Movie actors',
              'schema': Joi.object({
                firstName: Joi.string().min(1).max(255).required().description('Person first Name').example('Jennifer'),
                lastName: Joi.string().min(1).max(255).required().description('Person first Name').example('Lawrence'),
                age: Joi.number(),
                parentID: Joi.number(),
                ID:Joi.number(),
                address: Joi.object({
                  street: Joi.string(),
                  city: Joi.string(),
                  zipCode: Joi.string()
                })
              }).label('Get Movie actors schema')
            },
            '400': {
              'description': 'Bad Request',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(400),
                error: Joi.string().required().description('Error type').default('Bad Request'),
                message: Joi.string().required().description('Error message')
              }).label('Bad Request')
            },
            '401': {
              'description': 'Unauthorized',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(401),
                error: Joi.string().required().description('Error type').default('Unauthorized'),
                message: Joi.string().required().description('Error message').default('Invalid token')
              }).label('Unauthorized')
            },
            '404': {
              'description': 'Not Found',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(404),
                error: Joi.string().required().description('Error type').default('Not Found'),
                message: Joi.string().required().description('Error message').default('Movie Not Found')
              }).label('Not Found')
            },
            '500': {
              'description': 'internal server error',
              'schema': Joi.object({
                statusCode: Joi.number().required().description('Error Status Code').default(500),
                error: Joi.string().required().description('Error type').default('internal server error'),
                message: Joi.string().required().description('Error message')
              }).label('internal server error')
            }
          },
          payloadType: 'json',
        // security: [{ 'jwt': [] }]
        }
      }
    },
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
