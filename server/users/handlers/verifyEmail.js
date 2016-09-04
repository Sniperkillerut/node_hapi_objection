'use strict'

const Boom        = require('boom')
const User        = require('../models/User')
const Jwt         = require('jsonwebtoken')
const decyptToken = require('../util/userFunctions').decyptToken

module.exports = function (request, reply) {
  let privateKey = require('../config/auth').key.privateKey
  Jwt.verify(request.params.token, privateKey, function (error, decoded) {
    if (decoded === undefined) {
      reply(Boom.forbidden('invalid verification link'))
      return
    }
    decoded = decyptToken(decoded)
    if (decoded.scope[0] != 'User') {
      reply(Boom.forbidden('invalid verification link'))
      return
    }
    User.findOne({
      username: decoded.username,
      _id: decoded.id
    }, function (error, user) {
      if (error) {
        console.error(error)
        reply(Boom.badImplementation(error))
        return
      }
      if (user === null) {
        reply(Boom.forbidden('invalid verification link'))
        return
      }
      if (user.isVerified === true) {
        reply(Boom.forbidden('account is already verified'))
        return
      }
      user.isVerified = true
      user.save(function (error) {
        if (error) {
          console.error(error)
          reply(Boom.badImplementation(error))
          return
        }
        reply({message: 'account sucessfully verified'})
        return
      })
    })
  })
}