'use strict'

const Boom        = require('boom')
const createToken = require('../util/userFunctions').createToken

module.exports = function (request, reply) {
  // If the user's password is correct, we can issue a token.
  // If it was incorrect, the error will bubble up from the pre method
  // "Your email address is not verified. please verify your email address to proceed"
  if (request.pre.user === 'Your email address is not verified. please verify your email address to proceed') {
    reply(Boom.forbidden('Your email address is not verified. please verify your email address to proceed')) // HTTP 403 
    return
  }
  var tokenData = {
    username: request.pre.user._doc.username,
    scope: request.pre.user._doc.scope,
    id: request.pre.user._doc._id
  }
  var res = {
    username: request.pre.user._doc.username,
    scope: request.pre.user._doc.scope,
    token: createToken(tokenData)
  }
  reply(res).code(201)
}