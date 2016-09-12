'use strict'

const session = [
  'session', 'cookie', {
    password: 'Use a secure password',
    redirectTo: '/login', // If there is no session, redirect here
    isSecure: false // Should be set to true (which is the default) in production
  }
]
const twitter = [
  'twitter', 'bell', {
    provider: 'twitter',
    password: 'secret_cookie_encryption_password',
    clientId: 'your twitter API',
    clientSecret: 'your twitter api_key',
    isSecure: false // Should be set to true (which is the default) in production
  }
]
const linkedin = [
  'linkedin', 'bell', {
    provider: 'linkedin',
    scope: ['r_basicprofile', 'r_emailaddress'],
    password: 'secret_cookie_encryption_password',
    clientId: 'your linkedin api_key',
    clientSecret: 'your linkedin api_key',
    providerParams: {
      fields: ':(id,first-name,last-name,picture-urls::(original),headline,specialties,summary,email-address)'
      //add more fields from here https://developer.linkedin.com/docs/fields/basic-profile
    },
    isSecure: false, // Should be set to true (which is the default) in production
  }
]
const key = {
  privateKey: 'NeverShareYourSecret',
  tokenExpiry: 1 * 30 * 1000 * 60, // 1 hour
}
const server = {
  host: 'localhost',
  port: 5000
}
const validate = function (token, request, callback) {
  const Moment = require('moment')
  let decyptToken = require('../users/util/userFunctions').decyptToken
  // decrypt the token
  token = decyptToken(token)

  // Check token timestamp
  var diff = Moment().diff(Moment(token.iat * 1000))
  if (diff > key.tokenExpiry) {
    return callback(null, false)
  }
  return callback(null, true, token)
}
const jws = [
  'jwt', 'jwt', {
    validateFunc: validate,
    key: key.privateKey,
    verifyOptions: { algorithms: ['HS256'] }
  }
]
const user_db = {
  host: '127.0.0.1',
  port: 27017,
  db: 'your db',
  username: '',
  password: ''
}
// development and production keys are for API , and migrations too (Knex functionalaity)
const development = {
  client: 'postgresql',
  connection: {
    database: 'your db',
    host: '127.0.0.1',
    user: 'postgres',
    password: 'password'
  },
  pool: {
    min: 2,
    max: 10
  }
}
const production = {
  connection: {
    database: 'your db',
    host: '127.0.0.1',
    user: 'postgres',
    password: 'password'
  },
  pool: {
    min: 2,
    max: 10
  }
}
const email = {
  username: 'test@test.com',
  password: 'password',
  accountName: 'company name',
  verifyEmailUrl: 'users/verifyEmail'
}
const mailgun = {
  api_key: 'your mailgun api_key',
  domain: 'your mailgun API domain'
}

module.exports = {session, twitter, linkedin, jws, key, email, server, mailgun, user_db, development, production}

/**
    * "How to generate secret key?"
    * There are several options for generating secret keys. The easiest way is to run node's crypto hash in your terminal:
    * node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
    * or this other for Random URL and filename string safe (1 liner)
    * node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, ''));"
    * and copy the resulting base64 key and use it as your JWT secret.
    * If you are curious how strong that key is watch: https://youtu.be/koJQQWHI-ZA
*/
