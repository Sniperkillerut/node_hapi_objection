'use strict'

const Joi = require('joi')

module.exports = {
  e400:            {
    'description': 'Bad Request',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('Error Status Code').default(400),
      error:       Joi.string().required().description('Error type').default('Bad Request'),
      message:     Joi.string().required().description('Error message')
    }).label('Bad Request')
  },
  e401:            {
    'description': 'Unauthorized',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('Error Status Code').default(401),
      error:       Joi.string().required().description('Error type').default('Unauthorized'),
      message:     Joi.string().required().description('Error message').default('Invalid token')
    }).label('Unauthorized')
  },
  e403:            {
    'description': 'Forbidden',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('Error Status Code').default(403),
      error:       Joi.string().required().description('Error type').default('Forbidden'),
      message:     Joi.string().required().description('Error message').default('invalid verification link')
    }).label('Forbidden')
  },
  e404:            {
    'description': 'Not Found',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('Error Status Code').default(404),
      error:       Joi.string().required().description('Error type').default('Not Found'),
      message:     Joi.string().required().description('Error message')
    }).label('Not Found')
  },
  e500:            {
    'description': 'internal server error',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('Error Status Code').default(500),
      error:       Joi.string().required().description('Error type').default('internal server error'),
      message:     Joi.string().required().description('Error message')
    }).label('internal server error')
  },
  e503:            {
    'description': 'Service Unavailable',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('Error Status Code').default(500),
      error:       Joi.string().required().description('Error type').default('Service Unavailable'),
      message:     Joi.string().required().description('Error message').default('Try again in a few Hours')  
    }).label('Service Unavailable')
  }
}