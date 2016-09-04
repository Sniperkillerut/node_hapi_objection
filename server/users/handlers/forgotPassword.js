'use strict'

const Boom   = require('boom')
const User   = require('../models/User')
const Common = require('../util/common')

module.exports = function (request, reply) {
  User.findOne({
    $or: [
      { email: request.payload.email },
      { username: request.payload.username }
    ]
  }, function (error, user) {
    if (!error) {
      if (user === null) {
        reply(Boom.forbidden('invalid username or email'))
        return
      }
      Common.sentMailForgotPassword(user, (error) => {
        if (error) {
          reply(Boom.serverUnavailable('Try again in a few Hours'))
          return
        }
        reply({message: 'password is sent to registered email'})
      })
    }else {
      console.error(error)
      reply(Boom.badImplementation(error))
    }
  })
}