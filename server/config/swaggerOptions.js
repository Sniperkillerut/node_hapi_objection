'use strict'

const Pack = require('../../package')

module.exports = {
  basePath: '/',
  // pathPrefixSize: 2,
  // swaggerUI : false,
  // documentationPage : false,
  // swaggerUIPath: '/ui/',
  info: {
    title: 'Test API Documentation',
    version: Pack.version,
    description: 'This web API was built to demonstrate some of the hapi features and functionality.',
    termsOfService: 'https://github.com/glennjones/hapi-swagger/',
    contact: {
      name: 'test name',
      url: 'https://raw.githubusercontent.com/glennjones/hapi-swagger/master/license.txt',
      email: 'glennjonesnet@gmail.com'
    },
    license: {
      name: 'MIT',
      url: 'https://raw.githubusercontent.com/glennjones/hapi-swagger/master/license.txt'
    }
  },
  tags: [
    {
      name: 'api',
      description: 'API calls'
    }, {
      name: 'users',
      description: 'Users account management'
    }, {
      name: 'store',
      description: 'Storing a sum',
      externalDocs: {
        description: 'Find out more about storage',
        url: 'http://example.org'
      }
    }, {
      name: 'sum',
      description: 'API of sums',
      externalDocs: {
        description: 'Find out more about sums',
        url: 'http://example.org'
      }
    }
  ],
  // jsonEditor: true,
  securityDefinitions: {
    jwt: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  security: [{ 'jwt': [] }],
// auth: 'jwt' // must register the auth strategy before using it in swagger
}
