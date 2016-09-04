'use strict'

//Import Handlers
const createPersonHandler     = require('../api/handlers/createPerson')
const updatePersonHandler     = require('../api/handlers/updatePerson')
const getAllPersonsHandler    = require('../api/handlers/getAllPersons.js')
const deletePersonHandler     = require('../api/handlers/deletePerson')
const addChildToPersonHandler = require('../api/handlers/addChildToPerson')
const addPetToPersonHandler   = require('../api/handlers/addPetToPerson')
const getPersonPetsHandler    = require('../api/handlers/getPersonPets')
const createMovieHandler      = require('../api/handlers/createMovie')
const addPersonToMovieHandler = require('../api/handlers/addPersonToMovie')
const getMovieActorsHandler   = require('../api/handlers/getMovieActors')

//Import Config
const createPersonConfig      = require('../api/config/createPerson')
const updatePersonConfig      = require('../api/config/updatePerson')
const getAllPersonsConfig     = require('../api/config/getAllPersons')
const deletePersonConfig      = require('../api/config/deletePerson')
const addChildToPersonConfig  = require('../api/config/addChildToPerson')
const addPetToPersonConfig    = require('../api/config/addPetToPerson')
const getPersonPetsConfig     = require('../api/config/getPersonPets')
const createMovieConfig       = require('../api/config/createMovie')
const addPersonToMovieConfig  = require('../api/config/addPersonToMovie')
const getMovieActorsConfig    = require('../api/config/getMovieActors')


module.exports = [
  {
    method:  'POST',
    path:    '/api/persons',
    config:  createPersonConfig,
    handler: createPersonHandler
  },
  {
    method:  'PATCH',
    path:    '/api/persons/{id}',
    config:  updatePersonConfig,
    handler: updatePersonHandler 
  },
  {
    method:  'GET',
    path:    '/api/persons',
    config:  getAllPersonsConfig,
    handler: getAllPersonsHandler
  },
  {
    method:  'DELETE',
    path:    '/api/persons/{id}',
    config:  deletePersonConfig,
    handler: deletePersonHandler
  },
  {
    method:  'POST',
    path:    '/api/persons/{id}/children',
    config:  addChildToPersonConfig,
    handler: addChildToPersonHandler
  },
  {
    method:  'POST',
    path:    '/api/persons/{id}/pets',
    config:  addPetToPersonConfig,
    handler: addPetToPersonHandler
  },
  {
    method:  'GET',
    path:    '/api/persons/{id}/pets',
    config:  getPersonPetsConfig,
    handler: getPersonPetsHandler
  },
  {
    method:  'POST',
    path:    '/api/persons/{id}/movies',
    config:  createMovieConfig,
    handler: createMovieHandler   },
  {
    method:  'POST',
    path:    '/api/movies/{id}/actors',
    config:  addPersonToMovieConfig,
    handler: addPersonToMovieHandler 
  },
  {
    method:  'GET',
    path:    '/api/movies/{id}/actors',
    config:  getMovieActorsConfig,
    handler: getMovieActorsHandler
  }
]
