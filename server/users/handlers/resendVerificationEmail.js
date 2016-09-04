'use strict'

const Boom        = require('boom')
const User        = require('../models/User')
const Common      = require('../util/common')
const createToken = require('../util/userFunctions').createToken

module.exports = function (request, reply) {
  User.findOne({
    $or: [
      { email: request.payload.email },
      { username: request.payload.username }
    ]
  }, function (error, user) {
    if (!error) {
      if (user === null) {
        reply(Boom.forbidden('invalid username or password'))
        return
      }
      if (request.payload.password === Common.decrypt(user.password)) {
        if (user.isVerified) {
          reply({message: 'your email address is already verified'}).code(201)
          return
        }
        var tokenData = {
          username: user.username,
          scope: [user.scope],
          id: user._id
        }
        Common.sentMailVerificationLink(user, createToken(tokenData))
        reply({message: 'account verification link is sucessfully send to an email id'})
      }else {
        reply(Boom.forbidden('invalid username or password'))
      }
    }else {
      console.error(error)
      reply(Boom.badImplementation(error))
    }
  })
}
