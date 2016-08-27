'use strict';

const transaction = require('objection').transaction;
const Person = require('../models/Person');
const Movie = require('../models/Movie');
const Boom = require('boom');
const Joi = require('joi');

module.exports = [
    {
        config: {
            payload: {
                output: 'data',
                parse: true
            },            
            //description: 'Say hello!',
            //notes: 'The user parameter defaults to \'stranger\' if unspecified',
            //tags: ['api', 'greeting']
        },
        method: 'POST',
        path: '/persons',
        handler: function(request, reply){
            Person
            .query()
            .insertAndFetch(request.payload)
            .then(function(person){
                reply(person);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
        }
    },
    {
        config: {
            payload: {
                output: 'data',
                parse: true
            }
        },
        method: 'PATCH',
        path: '/persons/{id}',
        handler: function(request, reply){
            Person
            .query()
            .patchAndFetchById(request.params.id, request.payload)
            .then(function(person){
                reply(person);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
        }
    },
    {
        config: {
            validate: {
                params: {
                    minAge: Joi.number().integer(),
                    maxAge: Joi.number().integer(),
                    firstName: Joi.string().alphanum(),
                    eager: Joi.string()
                }
            },
        },
        method: 'GET',
        path: '/persons',
        handler: function(request, reply){
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
            .filterEager('pets', function(builder){
            // Order eagerly loaded pets by name.
                builder.orderBy('name');
            })
            .filterEager('children.pets', function(builder){
                // Only fetch dogs for children.
                builder.where('species', 'dog');
            })
            .then(function(persons){
                reply(persons);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
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
                    id:  Joi.number().integer().required()
                }
            },
        },
        method: 'DELETE',
        path: '/persons/{id}',
        handler: function(request, reply){
            Person
            .query()
            .deleteById(request.params.id)
            .then(function(){
                reply({});
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
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
        },
        method: 'POST',
        path: '/persons/{id}/children',
        handler: function(request, reply){
            Person
            .query()
            .findById(request.params.id)
            .then(function(person){
                if (!person){ 
                    reply(Boom.notFound('Person id=('+request.params.id+') not found!'));
                    return;
                }
                return person
                .$relatedQuery('children')
                .insert(request.payload);
            })
            .then(function(child){
                reply(child);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
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
        },
        method: 'POST',
        path: '/persons/{id}/pets',
        handler: function(request, reply){
            Person
            .query()
            .findById(request.params.id)
            .then(function(person){
                if (!person){
                    reply(Boom.notFound('Person id=('+request.params.id+') not found!'));
                    return;
                }
                return person
                .$relatedQuery('pets')
                .insert(request.payload);
            })
            .then(function(pet){
                reply(pet);
            })
            .catch(function(error){ 
                reply(Boom.badImplementation(error));
                return;
            });
        }
    },
    {
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().required()
                }
            },
        },
        method: 'GET',
        path: '/persons/{id}/pets',
        handler: function(request, reply){
            Person
            .query()
            .findById(request.params.id)
            .then(function(person){
                if (!person){
                    reply(Boom.notFound('Person id=('+request.params.id+') not found!'));
                    return;
                }
                // We don't need to check for the existence of the query parameters.
                // The query builder methods do nothing if one of the values is undefined.
                return person
                .$relatedQuery('pets')
                .where('name', 'like', request.query.name)
                .where('species', request.query.species);
            })
            .then(function(pets){
                reply(pets);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
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
        },
        method: 'POST',
        path: '/persons/{id}/movies',
        handler: function(request, reply){
            // Inserting a movie for a person creates two queries: the movie insert query
            // and the join table row insert query. It is wise to use a transaction here.
            transaction(Person, function(Person){
                return Person
                .query()
                .findById(request.params.id)
                .then(function(person){
                    if (!person){
                        reply(Boom.notFound('Person id=('+request.params.id+') not found!'));
                        return;
                    }
                    return person
                    .$relatedQuery('movies')
                    .insert(request.payload);
                });
            })
            .then(function(movie){
                reply(movie);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
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
        },
        method: 'POST',
        path: '/movies/{id}/actors',
        handler: function(request, reply){
            Movie
            .query()
            .findById(request.params.id)
            .then(function(movie){
                if (!movie){
                    reply(Boom.notFound('Movie id=('+request.params.id+') not found!'));
                    return;
                }
                return movie
                .$relatedQuery('actors')
                .relate(request.payload.id);
            })
            .then(function(){
                reply(request.payload);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
        }
    },
    {
        config: {
            validate: {
                params: {
                    id: Joi.number().integer().required()
                }
            },
        },
        method: 'GET',
        path: '/movies/{id}/actors',
        handler: function(request, reply){
            Movie
            .query()
            .findById(request.params.id)
            .then(function(movie){
                if (!movie){
                    reply(Boom.notFound('Movie id=('+request.params.id+') not found!'));
                    return;
                }
                return movie.$relatedQuery('actors');
            })
            .then(function(actors){
                reply(actors);
            })
            .catch(function(error){
                reply(Boom.badImplementation(error));
                return;
            });
        }
    },
];